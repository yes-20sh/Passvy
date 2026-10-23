import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventSchema } from '@/schemas/event.schema';
import { EventPromotionSchema } from '@/schemas/event-promotion.schema';
import { CreateEventInput, PromoteEventInput } from './dto/event.dto';
import { EventResponse } from './entities/event.response.entity';
import { CurrentUser } from '@/decorator/current-user.decorator';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorator/roles.decorator';
import { Role } from '@/enum';
import type { JwtUser } from '@/interface';
import { Public } from '@/decorator/public.decorator';

@Resolver(() => EventSchema)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Mutation(() => EventResponse)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async createEvent(
    @CurrentUser() user: JwtUser,
    @Args('input') input: CreateEventInput,
  ): Promise<EventResponse> {
    return this.eventsService.createEvent(user.sub, input);
  }

  @Query(() => EventResponse)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async getEvent(
    @CurrentUser() user: JwtUser,
    @Args('slug') slug: string,
  ): Promise<EventResponse> {
    return this.eventsService.getEvent(slug, user.sub, true);
  }

  @Query(() => EventResponse)
  @Public()
  async getEventDetail(
    @Args('slug') slug: string,
    @CurrentUser() user?: JwtUser,
  ): Promise<EventResponse> {
    return this.eventsService.getEvent(slug, user?.sub);
  }

  @Mutation(() => Boolean)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async promoteEvent(
    @CurrentUser() user: JwtUser,
    @Args('input') input: PromoteEventInput,
  ): Promise<boolean> {
    return this.eventsService.promoteEvent(user.sub, input);
  }

  @Query(() => [EventPromotionSchema])
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async getEventPromotions(
    @CurrentUser() user: JwtUser,
    @Args('eventSlug') eventSlug: string,
  ): Promise<EventPromotionSchema[]> {
    return this.eventsService.getEventPromotions(user.sub, eventSlug);
  }
}
