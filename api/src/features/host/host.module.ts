import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HostResolver } from './host.resolver';
import { HostService } from './host.service';
import { EventSchema } from '@/schemas/event.schema';
import { EventRegistrationSchema } from '@/schemas/event-registration.schema';

@Module({
  imports: [TypeOrmModule.forFeature([EventSchema, EventRegistrationSchema])],
  providers: [HostResolver, HostService],
})
export class HostModule {}
