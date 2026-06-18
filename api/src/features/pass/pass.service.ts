import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { EventRegistrationSchema } from '@/schemas/event-registration.schema';
import { EventSchema } from '@/schemas/event.schema';
import { PassResponseEntity } from './entities/pass.response.entity';
import { formatEventDates } from '@/helper/format-event-dates/format-event-dates.helper';

@Injectable()
export class PassService {
  private readonly logger = new Logger(PassService.name);

  constructor(
    @InjectRepository(EventRegistrationSchema)
    private registrationRepository: Repository<EventRegistrationSchema>,
    @InjectRepository(EventSchema)
    private eventRepository: Repository<EventSchema>,
  ) {}

  async getPasses(email: string): Promise<PassResponseEntity[]> {
    this.logger.log(`Fetching passes for email: ${email}`);
    try {
      const registrations = await this.registrationRepository.find({
        where: { email },
        order: { createdAt: 'DESC' },
      });

      if (!registrations.length) {
        return [];
      }

      const eventIds = registrations.map((r) => r.eventId);

      const events = await this.eventRepository.find({
        where: { id: In(eventIds) },
        relations: { mode: true, passes: true },
      });

      // Map registrations to events
      return registrations
        .map((registration) => {
          const event = events.find((e) => e.id === registration.eventId);
          if (!event) {
            // This theoretically shouldn't happen unless database integrity is broken
            this.logger.warn(
              `Event ${registration.eventId} not found for registration ${registration.id}`,
            );
            return null;
          }

          formatEventDates(event);

          return {
            registration,
            event,
          };
        })
        .filter((res): res is NonNullable<typeof res> => res !== null);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error fetching passes: ${err.message}`, err.stack);
      throw new InternalServerErrorException('Failed to fetch passes');
    }
  }

  async getPassDetail(
    email: string,
    slugOrId: string,
  ): Promise<PassResponseEntity> {
    this.logger.log(
      `Fetching pass detail for email: ${email}, slugOrId: ${slugOrId}`,
    );
    try {
      const registration = await this.registrationRepository.findOne({
        where: [
          { email, slug: slugOrId },
          { email, eventId: slugOrId },
        ],
        order: { createdAt: 'DESC' },
      });

      if (!registration) {
        throw new NotFoundException('Pass not found');
      }

      const event = await this.eventRepository.findOne({
        where: { id: registration.eventId },
        relations: { mode: true, passes: true },
      });

      if (!event) {
        throw new NotFoundException('Event not found for this pass');
      }

      formatEventDates(event);

      return {
        registration,
        event,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error fetching pass detail: ${err.message}`,
        err.stack,
      );
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch pass detail');
    }
  }

  async checkInPass(
    eventId: string,
    ticketCode: string,
  ): Promise<EventRegistrationSchema> {
    this.logger.log(
      `Checking in pass for event: ${eventId}, ticket: ${ticketCode}`,
    );
    try {
      // The ticket code format is PV-XXXXXXXX
      const parts = ticketCode.split('-');
      const uuidPrefix =
        parts.length > 1 ? parts[1].toLowerCase() : ticketCode.toLowerCase();

      // Search for registration matching the eventId and starting with the prefix
      const registration = await this.registrationRepository.findOne({
        where: {
          eventId,
          id: Like(`${uuidPrefix}%`),
        },
      });

      if (!registration) {
        throw new NotFoundException(
          'Ticket is invalid or not registered for this event',
        );
      }

      if (registration.isCheckedIn) {
        throw new ConflictException('Ticket has already been checked in!');
      }

      registration.isCheckedIn = true;
      return await this.registrationRepository.save(registration);
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error checking in pass: ${err.message}`, err.stack);
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to check in pass');
    }
  }
}
