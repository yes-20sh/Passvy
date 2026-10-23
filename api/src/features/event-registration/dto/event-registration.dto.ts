import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateEventRegistrationInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  mobileNumber?: string;
}
