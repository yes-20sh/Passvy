import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventSchema } from '@/schemas/event.schema';
import { SavedEventSchema } from '@/schemas/saved-event.schema';
import {
  GetEventsListInput,
  SaveEventInput,
  GetSavedEventsInput,
} from './dto/events-list.dto';
import { EventsListResponse } from './entities/events-list.response.entity';
import { EventMode, EventStatus } from '@/enum';
import { PaginationService } from '@/service/pagination/pagination.service';

import { formatEventDates } from '@/helper/format-event-dates/format-event-dates.helper';

@Injectable()
export class EventsListService {
  private readonly logger = new Logger(EventsListService.name);

  constructor(
    @InjectRepository(EventSchema)
    private readonly eventRepository: Repository<EventSchema>,
    @InjectRepository(SavedEventSchema)
    private readonly savedEventRepository: Repository<SavedEventSchema>,
    private readonly paginationService: PaginationService,
  ) {}

  async getEventsList(input: GetEventsListInput): Promise<EventsListResponse> {
    try {
      const query = this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.mode', 'mode')
        .leftJoinAndSelect('event.passes', 'passes')
        .where('event.status = :status', { status: EventStatus.PUBLISHED });

      if (input.category) {
        query.andWhere('event.category = :category', {
          category: input.category,
        });
      }

      if (input.search) {
        query.andWhere('event.title ILIKE :search', {
          search: `%${input.search}%`,
        });
      }

      if (input.filter) {
        const filterStr = input.filter.toLowerCase();
        if (filterStr === 'upcoming') {
          query.andWhere(
            `(event.startDate > CURRENT_DATE OR (event.startDate = CURRENT_DATE AND event.startTime > CURRENT_TIME))`,
          );
        } else if (filterStr === 'past') {
          query.andWhere(
            `(event.endDate < CURRENT_DATE OR (event.endDate = CURRENT_DATE AND event.endTime < CURRENT_TIME))`,
          );
        } else if (filterStr === 'ongoing') {
          query.andWhere(
            `((event.startDate < CURRENT_DATE OR (event.startDate = CURRENT_DATE AND event.startTime <= CURRENT_TIME)) AND (event.endDate > CURRENT_DATE OR (event.endDate = CURRENT_DATE AND event.endTime >= CURRENT_TIME)))`,
          );
        }
      }

      // Cursor Pagination Logic
      if (input.cursor) {
        // We use createdAt as the stable cursor.
        // Assuming we want newest events first, so we query older than the cursor.
        query.andWhere('event.createdAt < :cursor', {
          cursor: new Date(input.cursor),
        });
      }

      query.orderBy('event.createdAt', 'DESC');

      const limit = input.limit && input.limit > 0 ? input.limit : 10;
      query.take(limit + 1);

      const events = await query.getMany();

      events.forEach((event) => {
        formatEventDates(event);
        if (event.mode && event.mode.eventMode === EventMode.ONLINE) {
          event.mode.city = null;
          event.mode.state = null;
        }
      });

      const paginatedResult = this.paginationService.paginateCursor(
        events,
        { cursor: input.cursor, limit },
        (item) => item.createdAt.toISOString(),
      );

      // The returned entities match the PickType base entity requirements perfectly.
      // GraphQL automatically omits unrequested fields based on the ObjectType schema.

      return {
        events: paginatedResult.data,
        meta: paginatedResult.meta,
      };
    } catch (error) {
      this.logger.error(
        'Failed to fetch events list',
        error instanceof Error ? error.stack : error,
      );
      throw new InternalServerErrorException('Failed to fetch events list');
    }
  }

  async saveEvent(input: SaveEventInput, userId: string): Promise<boolean> {
    try {
      const event = await this.eventRepository.findOne({
        where: { slug: input.eventSlug },
      });

      if (!event) {
        throw new Error('Event not found');
      }

      const existingSavedEvent = await this.savedEventRepository.findOne({
        where: { userId, eventId: event.id },
      });

      if (existingSavedEvent) {
        await this.savedEventRepository.remove(existingSavedEvent);
        return false; // Indicating the event was unsaved
      } else {
        const savedEvent = this.savedEventRepository.create({
          userId,
          eventId: event.id,
        });
        await this.savedEventRepository.save(savedEvent);
        return true; // Indicating the event was saved
      }
    } catch (error) {
      this.logger.error(
        'Failed to save event',
        error instanceof Error ? error.stack : error,
      );
      throw new InternalServerErrorException('Failed to save event');
    }
  }

  async getSavedEvents(
    input: GetSavedEventsInput,
    userId: string,
  ): Promise<EventsListResponse> {
    try {
      const query = this.savedEventRepository
        .createQueryBuilder('saved_event')
        .innerJoinAndSelect('saved_event.event', 'event')
        .leftJoinAndSelect('event.mode', 'mode')
        .leftJoinAndSelect('event.passes', 'passes')
        .where('saved_event.user_id = :userId', { userId });

      if (input.cursor) {
        query.andWhere('saved_event.created_at < :cursor', {
          cursor: new Date(input.cursor),
        });
      }

      query.orderBy('saved_event.created_at', 'DESC');

      const limit = input.limit && input.limit > 0 ? input.limit : 10;
      query.take(limit + 1);

      const savedEvents = await query.getMany();
      const events = savedEvents.map((se) => se.event);

      events.forEach((event) => {
        formatEventDates(event);
        if (event.mode && event.mode.eventMode === EventMode.ONLINE) {
          event.mode.city = null;
          event.mode.state = null;
        }
      });

      // The cursor should be based on the saved_event creation date, so we use the original savedEvents array for pagination logic
      const paginatedResult = this.paginationService.paginateCursor(
        savedEvents,
        { cursor: input.cursor, limit },
        (item) => item.createdAt.toISOString(),
      );

      return {
        events: paginatedResult.data.map((se) => {
          return Object.assign(se.event, {
            isSaved: true,
          });
        }),
        meta: paginatedResult.meta,
      };
    } catch (error) {
      this.logger.error(
        'Failed to fetch saved events list',
        error instanceof Error ? error.stack : error,
      );
      throw new InternalServerErrorException(
        'Failed to fetch saved events list',
      );
    }
  }
}
