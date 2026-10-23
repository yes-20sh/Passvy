import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsService } from './settings.service';
import { SettingsResolver } from './settings.resolver';
import { CloudinaryModule } from '@/config/cloudinary/cloudinary.module';
import SCHEMAS from '@/schemas/schemas';

@Module({
  imports: [TypeOrmModule.forFeature(SCHEMAS), CloudinaryModule],
  providers: [SettingsResolver, SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
