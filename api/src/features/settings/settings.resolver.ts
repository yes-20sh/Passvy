import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsResponse } from './entities/settings.response.entity';
import { UpdateSettingsInput } from './dto/settings.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorator/roles.decorator';
import { CurrentUser } from '../../decorator/current-user.decorator';

import { UserSchema } from '../../schemas/user.schema';
import { Role } from '@/enum';

@Resolver()
export class SettingsResolver {
  constructor(private readonly settingsService: SettingsService) {}

  @Query(() => SettingsResponse)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async getSettings(
    @CurrentUser() user: UserSchema,
  ): Promise<SettingsResponse> {
    return this.settingsService.getSettings(user.id);
  }

  @Mutation(() => SettingsResponse)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async updateSettings(
    @CurrentUser() user: UserSchema,
    @Args('input') input: UpdateSettingsInput,
  ): Promise<SettingsResponse> {
    return this.settingsService.updateSettings(user.id, input);
  }
}
