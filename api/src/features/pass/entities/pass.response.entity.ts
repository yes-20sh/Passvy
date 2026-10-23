import { ObjectType, Field } from '@nestjs/graphql';
import { EventSchema } from '@/schemas/event.schema';
import { EventRegistrationSchema } from '@/schemas/event-registration.schema';

@ObjectType()
export class PassResponseEntity {
  @Field(() => EventRegistrationSchema)
  registration: EventRegistrationSchema;

  @Field(() => EventSchema)
  event: EventSchema;
}
