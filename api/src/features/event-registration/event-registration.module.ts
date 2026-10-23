import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventRegistrationService } from './event-registration.service';
import { EventRegistrationResolver } from './event-registration.resolver';
import { EventRegistrationSchema } from '@/schemas/event-registration.schema';

@Module({
  imports: [TypeOrmModule.forFeature([EventRegistrationSchema])],
  providers: [EventRegistrationResolver, EventRegistrationService],
  exports: [EventRegistrationService],
})
export class EventRegistrationModule {}
