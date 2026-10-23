import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';

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

@InputType()
export class SaveEventInput {
  @Field()
  @IsString()
  eventSlug: string;
}

@InputType()
export class GetSavedEventsInput {
  @Field({ nullable: true })
  cursor?: string;

  @Field(() => Int, { nullable: true })
  limit?: number;
}
