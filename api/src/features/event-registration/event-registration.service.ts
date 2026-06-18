import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventRegistrationSchema } from '@/schemas/event-registration.schema';
import { CreateEventRegistrationInput } from './dto/event-registration.dto';
import { EventRegistrationResponse } from './entities/event-registration.response.entity';

@Injectable()
export class EventRegistrationService {
  private readonly logger = new Logger(EventRegistrationService.name);

  constructor(
    @InjectRepository(EventRegistrationSchema)
    private registrationRepository: Repository<EventRegistrationSchema>,
  ) {}

  async createRegistration(
    input: CreateEventRegistrationInput,
  ): Promise<EventRegistrationResponse> {
    this.logger.log(`Creating event registration for: ${input.email}`);
    try {
      const newRegistration = this.registrationRepository.create({
        slug: input.slug,
        eventId: input.eventId,
        name: input.name,
        email: input.email,
        mobileNumber: input.mobileNumber || null,
      });

      await this.registrationRepository.save(newRegistration);

      return {
        message: 'Event registration completed successfully',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error creating event registration: ${err.message}`);
      throw new InternalServerErrorException(
        'Failed to create event registration',
      );
    }
  }
}
