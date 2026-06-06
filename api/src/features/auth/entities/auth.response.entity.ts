import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => Int)
  statusCode: number;
}

@ObjectType()
export class SuccessResponse {
  @Field()
  message: string;

  @Field(() => Int)
  statusCode: number;
}
