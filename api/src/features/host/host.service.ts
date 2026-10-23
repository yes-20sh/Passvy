import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventSchema } from '@/schemas/event.schema';
import { EventRegistrationSchema } from '@/schemas/event-registration.schema';
import {
  GetHostEventsInput,
  HostEventFilter,
  GetRegisteredAttendeesInput,
  ExportRegisteredAttendeesInput,
} from './dto/host-event.dto';
import {
  HostEventData,
  HostEventsResponse,
  RegisteredAttendeesResponse,
} from './entities/host-event.response.entity';
import { EventMode } from '@/enum/event/event.enum';
import { PaginationService } from '@/service/pagination/pagination.service';

@Injectable()
export class HostService {
  private readonly logger = new Logger(HostService.name);

  constructor(
    @InjectRepository(EventSchema)
    private eventRepository: Repository<EventSchema>,
    @InjectRepository(EventRegistrationSchema)
    private registrationRepository: Repository<EventRegistrationSchema>,
    private readonly paginationService: PaginationService,
  ) {}

  async getHostEvents(
    userId: string,
    input: GetHostEventsInput,
  ): Promise<HostEventsResponse> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const queryBuilder = this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.mode', 'mode')
        .where('event.creator_id = :userId', { userId });

      if (input.filter === HostEventFilter.UPCOMING) {
        queryBuilder.andWhere('event.start_date > :today', { today });
      } else if (input.filter === HostEventFilter.ONGOING) {
        queryBuilder
          .andWhere('event.start_date <= :today', { today })
          .andWhere('(event.end_date >= :today OR event.end_date IS NULL)', {
            today,
          });
      } else if (input.filter === HostEventFilter.PAST) {
        queryBuilder.andWhere('event.end_date < :today', { today });
      }

      if (input.search) {
        queryBuilder.andWhere(
          '(event.title ILIKE :search OR event.category ILIKE :search)',
          { search: `%${input.search}%` },
        );
      }

      const events = await queryBuilder.getMany();

      if (events.length === 0) {
        return { events: [] };
      }

      const eventIds = events.map((e) => e.id);

      const counts = await this.registrationRepository
        .createQueryBuilder('reg')
        .select('reg.eventId', 'eventId')
        .addSelect('COUNT(reg.id)', 'count')
        .where('reg.eventId IN (:...eventIds)', { eventIds })
        .groupBy('reg.eventId')
        .getRawMany();

      const countMap = new Map<string, number>(
        counts.map((c: { eventId: string; count: string }) => [
          c.eventId,
          Number(c.count),
        ]),
      );

      const hostEvents: HostEventData[] = events.map((event) => {
        const registeredCount = countMap.get(event.id) || 0;

        return {
          id: event.id,
          slug: event.slug,
          headerImage: event.headerImage,
          title: event.title,
          category: event.category ?? '',
          registeredCount,
          startDate: event.startDate ? new Date(event.startDate) : null,
          startTime: event.startTime,
          endDate: event.endDate ? new Date(event.endDate) : null,
          endTime: event.endTime,
          location:
            event.mode?.city && event.mode?.state
              ? `${event.mode.city}, ${event.mode.state}`
              : null,
          isOnline: event.mode?.eventMode === EventMode.ONLINE,
          status: input.filter,
        };
      });

      return { events: hostEvents };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to fetch host events: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error('Failed to fetch host events: Unknown error');
      }
      throw new InternalServerErrorException('Failed to fetch host events');
    }
  }

  async getRegisteredAttendees(
    userId: string,
    input: GetRegisteredAttendeesInput,
  ): Promise<RegisteredAttendeesResponse> {
    try {
      // Verify event belongs to host
      const event = await this.eventRepository.findOne({
        where: { slug: input.slug, creatorId: userId },
      });

      if (!event) {
        throw new InternalServerErrorException(
          'Event not found or unauthorized',
        );
      }

      const { skip, take } = this.paginationService.getSkipTake({
        page: input.page,
        limit: input.limit,
      });

      const queryBuilder = this.registrationRepository
        .createQueryBuilder('reg')
        .where('reg.eventId = :eventId', { eventId: event.id })
        .orderBy('reg.created_at', 'DESC')
        .skip(skip)
        .take(take);

      if (input.search) {
        queryBuilder.andWhere(
          '(reg.name ILIKE :search OR reg.email ILIKE :search OR reg.mobileNumber ILIKE :search)',
          { search: `%${input.search}%` },
        );
      }

      const [registrations, totalItems] = await queryBuilder.getManyAndCount();

      const paginatedResult = this.paginationService.paginate(
        registrations,
        totalItems,
        { page: input.page, limit: input.limit },
      );

      const data = paginatedResult.data.map((reg) => {
        // Mocking fields that don't exist in DB schema yet
        const ticketId = `TKT-${reg.id.substring(0, 6).toUpperCase()}`;
        const passType = 'General Admission';
        const status = 'Registered';

        return {
          id: reg.id,
          name: reg.name,
          email: reg.email,
          mobileNumber: reg.mobileNumber,
          passType,
          ticketId,
          registerDate: reg.createdAt,
          status,
        };
      });

      // Simple in-memory filter for the mocked fields
      let filteredData = data;
      if (input.status && input.status !== 'all') {
        filteredData = filteredData.filter((d) => d.status === input.status);
      }
      if (input.passType && input.passType !== 'all') {
        filteredData = filteredData.filter(
          (d) => d.passType === input.passType,
        );
      }

      return {
        data: filteredData,
        meta: paginatedResult.meta,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to fetch registered attendees: ${error.message}`,
          error.stack,
        );
      }
      throw new InternalServerErrorException(
        'Failed to fetch registered attendees',
      );
    }
  }

  async exportRegisteredAttendees(
    userId: string,
    input: ExportRegisteredAttendeesInput,
  ): Promise<string> {
    try {
      const event = await this.eventRepository.findOne({
        where: { slug: input.slug, creatorId: userId },
      });

      if (!event) {
        throw new InternalServerErrorException(
          'Event not found or unauthorized',
        );
      }

      const registrations = await this.registrationRepository.find({
        where: { eventId: event.id },
        order: { createdAt: 'DESC' },
      });

      const data = registrations.map((reg) => {
        const ticketId = `TKT-${reg.id.substring(0, 6).toUpperCase()}`;
        const passType = 'General Admission';
        const status = 'Registered';

        return {
          id: reg.id,
          name: reg.name,
          email: reg.email,
          mobileNumber: reg.mobileNumber || '',
          passType,
          ticketId,
          registerDate: reg.createdAt.toISOString(),
          status,
        };
      });

      if (data.length === 0) {
        return '';
      }

      const headers = input.columns;
      const csvRows: string[] = [];
      csvRows.push(headers.join(','));

      for (const row of data) {
        const values = headers.map((header) => {
          const key = header as keyof typeof row;
          const value = row[key] || '';
          const stringValue = String(value).replace(/"/g, '""');
          return `"${stringValue}"`;
        });
        csvRows.push(values.join(','));
      }

      return csvRows.join('\n');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to export registered attendees: ${error.message}`,
          error.stack,
        );
      }
      throw new InternalServerErrorException(
        'Failed to export registered attendees',
      );
    }
  }
}
