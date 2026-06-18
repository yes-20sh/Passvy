import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EventRegistrationService } from './event-registration.service';
import { EventRegistrationResponse } from './entities/event-registration.response.entity';
import { CreateEventRegistrationInput } from './dto/event-registration.dto';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorator/roles.decorator';
import { Role } from '@/enum';

@Resolver()
export class EventRegistrationResolver {
  constructor(
    private readonly eventRegistrationService: EventRegistrationService,
  ) {}

  @Mutation(() => EventRegistrationResponse)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async createEventRegistration(
    @Args('input') input: CreateEventRegistrationInput,
  ): Promise<EventRegistrationResponse> {
    return this.eventRegistrationService.createRegistration(input);
  }
}
