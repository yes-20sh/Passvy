import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsResponse } from './entities/settings.response.entity';
import { UpdateSettingsInput } from './dto/settings.dto';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorator/roles.decorator';
import { CurrentUser } from '@/decorator/current-user.decorator';
import { Role } from '@/enum';

export interface JwtUser {
  sub: string;
  email: string;
  role: string;
}

@Resolver()
export class SettingsResolver {
  constructor(private readonly settingsService: SettingsService) {}

  @Query(() => SettingsResponse)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async getSettings(@CurrentUser() user: JwtUser): Promise<SettingsResponse> {
    return this.settingsService.getSettings(user.sub);
  }

  @Mutation(() => SettingsResponse)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async updateSettings(
    @CurrentUser() user: JwtUser,
    @Args('input') input: UpdateSettingsInput,
  ): Promise<SettingsResponse> {
    return this.settingsService.updateSettings(user.sub, input);
  }
}
