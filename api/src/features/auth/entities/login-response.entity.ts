import { ObjectType, Field } from '@nestjs/graphql';
import { UserResponse } from './user.response.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  token: string;

  @Field(() => UserResponse)
  user: UserResponse;
}
