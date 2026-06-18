import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class EventRegistrationResponse {
  @Field(() => String)
  message: string;
}
