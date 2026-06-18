import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassResolver } from './pass.resolver';
import { PassService } from './pass.service';
import { EventRegistrationSchema } from '@/schemas/event-registration.schema';
import { EventSchema } from '@/schemas/event.schema';

@Module({
  imports: [TypeOrmModule.forFeature([EventRegistrationSchema, EventSchema])],
  providers: [PassResolver, PassService],
})
export class PassModule {}
