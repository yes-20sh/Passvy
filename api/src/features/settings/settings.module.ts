import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsService } from './settings.service';
import { SettingsResolver } from './settings.resolver';
import { UserSchema } from '@/schemas/user.schema';
import { CloudinaryModule } from '@/config/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema]), CloudinaryModule],
  providers: [SettingsResolver, SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
