import { ObjectType, Field, Int } from '@nestjs/graphql';
import { EventSchema } from '@/schemas/event.schema';

@ObjectType()
export class EventResponse {
  @Field()
  message: string;

  @Field(() => Int)
  statusCode: number;

  @Field(() => EventSchema, { nullable: true })
  event?: EventSchema;
}
