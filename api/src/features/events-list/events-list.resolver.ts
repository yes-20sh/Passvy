import { Resolver, Query, Args } from '@nestjs/graphql';
import { EventsListService } from './events-list.service';
import { EventsListResponse } from './entities/events-list.response.entity';
import { GetEventsListInput } from './dto/events-list.dto';
import { Public } from '@/decorator/public.decorator';

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
}
