import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PassService } from './pass.service';
import { PassResponseEntity } from './entities/pass.response.entity';
import { EventRegistrationSchema } from '@/schemas/event-registration.schema';
import { CurrentUser } from '@/decorator/current-user.decorator';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorator/roles.decorator';
import { Role } from '@/enum';
import type { JwtUser } from '@/interface';

@Resolver()
export class PassResolver {
  constructor(private readonly passService: PassService) {}

  @Query(() => [PassResponseEntity])
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async getPasses(@CurrentUser() user: JwtUser): Promise<PassResponseEntity[]> {
    // The JwtUser payload contains the user's email which maps to event_registrations
    return this.passService.getPasses(user.email);
  }

  @Query(() => PassResponseEntity)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async getPassDetail(
    @CurrentUser() user: JwtUser,
    @Args('slug') slug: string,
  ): Promise<PassResponseEntity> {
    return this.passService.getPassDetail(user.email, slug);
  }

  @Mutation(() => EventRegistrationSchema)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async checkInPass(
    @Args('eventId') eventId: string,
    @Args('ticketCode') ticketCode: string,
  ): Promise<EventRegistrationSchema> {
    return this.passService.checkInPass(eventId, ticketCode);
  }
}
