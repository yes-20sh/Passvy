import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { HostService } from './host.service';
import {
  HostEventsResponse,
  RegisteredAttendeesResponse,
} from './entities/host-event.response.entity';
import {
  GetHostEventsInput,
  GetRegisteredAttendeesInput,
} from './dto/host-event.dto';
import { CurrentUser } from '@/decorator/current-user.decorator';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorator/roles.decorator';
import { Role } from '@/enum';
import type { JwtUser } from '@/interface';

@Resolver()
export class HostResolver {
  constructor(private readonly hostService: HostService) {}

  @Query(() => HostEventsResponse)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async getHostEvents(
    @CurrentUser() user: JwtUser,
    @Args('input') input: GetHostEventsInput,
  ): Promise<HostEventsResponse> {
    return this.hostService.getHostEvents(user.sub, input);
  }

  @Query(() => RegisteredAttendeesResponse)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async getRegisteredAttendees(
    @CurrentUser() user: JwtUser,
    @Args('input') input: GetRegisteredAttendeesInput,
  ): Promise<RegisteredAttendeesResponse> {
    return this.hostService.getRegisteredAttendees(user.sub, input);
  }
}
