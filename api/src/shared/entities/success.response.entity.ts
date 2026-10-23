import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SuccessResponse {
  @Field()
  message: string;

  @Field(() => Int)
  statusCode: number;
}
