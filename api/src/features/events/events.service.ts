import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventSchema } from '@/schemas/event.schema';
import { CreateEventInput } from './dto/event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(EventSchema)
    private readonly eventRepository: Repository<EventSchema>,
  ) {}

  async createEvent(
    userId: string,
    input: CreateEventInput,
  ): Promise<EventSchema> {
    try {
      const newEvent = this.eventRepository.create({
        ...input,
        creatorId: userId,
      });
      const savedEvent = await this.eventRepository.save(newEvent);
      return savedEvent;
    } catch (error) {
      this.logger.error('Failed to create event', error);
      throw new InternalServerErrorException('Failed to create event');
    }
  }
}
