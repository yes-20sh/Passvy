import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventSchema } from '@/schemas/event.schema';
import { CreateEventInput } from './dto/event.dto';
import { EventResponse } from './entities/event.response.entity';
import { CurrentUser } from '@/decorator/current-user.decorator';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorator/roles.decorator';
import { Role } from '@/enum';
import type { JwtUser } from '@/interface';

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
    const event = await this.eventsService.createEvent(user.sub, input);
    return {
      message: 'Event created successfully',
      statusCode: 201,
      event,
    };
  }
}
