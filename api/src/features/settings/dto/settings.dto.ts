import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsArray, IsEnum } from 'class-validator';
import { Theme } from '@/enum';

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

  @Field(() => Theme, { nullable: true })
  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;

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
