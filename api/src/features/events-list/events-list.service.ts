import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventSchema } from '@/schemas/event.schema';
import { GetEventsListInput } from './dto/events-list.dto';
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
}
