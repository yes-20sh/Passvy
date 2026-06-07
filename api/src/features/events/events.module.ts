import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import SCHEMAS from '@/schemas/schemas';

import { CloudinaryModule } from '@/config/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature(SCHEMAS), CloudinaryModule],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
