import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => Int)
  statusCode: number;
}
