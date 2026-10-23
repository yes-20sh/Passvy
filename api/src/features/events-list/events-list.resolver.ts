import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EventsListService } from './events-list.service';
import { EventsListResponse } from './entities/events-list.response.entity';
import {
  GetEventsListInput,
  SaveEventInput,
  GetSavedEventsInput,
} from './dto/events-list.dto';
import { Public } from '@/decorator/public.decorator';
import { CurrentUser } from '@/decorator/current-user.decorator';
import type { JwtUser } from '@/interface';

@Resolver()
export class EventsListResolver {
  constructor(private readonly eventsListService: EventsListService) {}

  @Public()
  @Query(() => EventsListResponse)
  async getEventsList(
    @Args('input', { nullable: true, defaultValue: {} })
    input: GetEventsListInput,
  ): Promise<EventsListResponse> {
    return this.eventsListService.getEventsList(input);
  }

  @Mutation(() => Boolean)
  async saveEvent(
    @Args('input') input: SaveEventInput,
    @CurrentUser() user: JwtUser,
  ): Promise<boolean> {
    return this.eventsListService.saveEvent(input, user.sub);
  }

  @Query(() => EventsListResponse)
  async getSavedEvents(
    @Args('input', { nullable: true, defaultValue: {} })
    input: GetSavedEventsInput,
    @CurrentUser() user: JwtUser,
  ): Promise<EventsListResponse> {
    return this.eventsListService.getSavedEvents(input, user.sub);
  }
}
