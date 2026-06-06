import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsArray } from 'class-validator';

@InputType()
export class UpdateSettingsInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fullName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  theme?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  eventPreferences?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatar?: string;
}
