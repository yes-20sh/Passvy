import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { EventSchema } from '@/schemas/event.schema';

@Module({
  imports: [TypeOrmModule.forFeature([EventSchema])],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
