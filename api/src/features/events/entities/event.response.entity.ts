import { ObjectType, Field } from '@nestjs/graphql';
import { EventSchema } from '@/schemas/event.schema';

@ObjectType()
export class EventResponse {
  @Field()
  message: string;

  @Field(() => EventSchema, { nullable: true })
  event?: EventSchema;
}
