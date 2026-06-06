import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserResponse {
  @Field(() => ID)
  id: string;

  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field()
  mobileNumber: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class SignupResponse {
  @Field()
  message: string;

  @Field(() => UserResponse)
  user: UserResponse;
}
