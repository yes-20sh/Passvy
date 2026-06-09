import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class GetEventsListInput {
  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  filter?: string;

  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  cursor?: string;

  @Field(() => Int, { nullable: true })
  limit?: number;
}
