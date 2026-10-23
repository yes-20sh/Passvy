import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventSchema } from '@/schemas/event.schema';
import { SavedEventSchema } from '@/schemas/saved-event.schema';
import { EventsListService } from './events-list.service';
import { EventsListResolver } from './events-list.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([EventSchema, SavedEventSchema])],
  providers: [EventsListResolver, EventsListService],
})
export class EventsListModule {}
