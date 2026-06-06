import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSchema } from '../../schemas/user.schema';
import { UpdateSettingsInput } from './dto/settings.dto';
import { SettingsResponse } from './entities/settings.response.entity';
import { CloudinaryService } from '../../config/cloudinary/cloudinary.service';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectRepository(UserSchema)
    private userRepository: Repository<UserSchema>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async updateSettings(
    userId: string,
    input: UpdateSettingsInput,
  ): Promise<SettingsResponse> {
    this.logger.log(`Updating settings for user: ${userId}`);
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (input.fullName !== undefined) user.fullName = input.fullName;
      if (input.mobileNumber !== undefined)
        user.mobileNumber = input.mobileNumber;
      if (input.theme !== undefined) user.theme = input.theme;
      if (input.eventPreferences !== undefined)
        user.eventPreferences = input.eventPreferences;
      if (input.avatar !== undefined) {
        if (input.avatar.startsWith('data:image')) {
          const secureUrl = await this.cloudinaryService.uploadImage(
            input.avatar,
          );
          user.avatar = secureUrl;
        } else {
          user.avatar = input.avatar;
        }
      }

      const updatedUser = await this.userRepository.save(user);

      return {
        success: true,
        message: 'Settings updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const err = error as Error;
      this.logger.error(`Error updating settings: ${err.message}`);
      throw new InternalServerErrorException('Failed to update settings');
    }
  }

  async getSettings(userId: string): Promise<SettingsResponse> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        success: true,
        message: 'Settings retrieved successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const err = error as Error;
      this.logger.error(`Error fetching settings: ${err.message}`);
      throw new InternalServerErrorException('Failed to fetch settings');
    }
  }
}
