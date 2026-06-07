import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  EventMode,
  EventStatus,
  BlockType,
  PassPricing,
  PassTier,
  DiscountType,
  PayoutMethod,
} from '@/enum';

@InputType()
export class CreateDescriptionBlockInput {
  @Field(() => BlockType)
  @IsEnum(BlockType)
  blockType: BlockType;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  content?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  headingLevel?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  textSize?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  listStyle?: string;

  @Field(() => Int)
  @IsInt()
  sortOrder: number;
}

@InputType()
export class CreateEventPassInput {
  @Field(() => PassPricing)
  @IsEnum(PassPricing)
  pricing: PassPricing;

  @Field(() => PassTier)
  @IsEnum(PassTier)
  tier: PassTier;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  customName?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  passCategory?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  quantity?: number;

  @Field(() => Float)
  @IsNumber()
  price: number;
}

@InputType()
export class CreateEventCouponInput {
  @Field()
  @IsString()
  code: string;

  @Field(() => DiscountType)
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @Field(() => Float)
  @IsNumber()
  discountValue: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  usageLimit?: number;
}

@InputType()
export class CreateEventPaymentSettingInput {
  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  acceptedMethods: string[];

  @Field(() => PayoutMethod, { nullable: true })
  @IsEnum(PayoutMethod)
  @IsOptional()
  payoutMethod?: PayoutMethod;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  payoutUpiId?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  payoutBankName?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  payoutAccountName?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  payoutAccountNumber?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  payoutIfsc?: string;
}

@InputType()
export class CreateEventInput {
  @Field()
  @IsString()
  title: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  headerImage?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  startDate?: Date;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  startTime?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  endDate?: Date;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  endTime?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  category?: string;

  @Field(() => EventMode)
  @IsEnum(EventMode)
  eventMode: EventMode;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  onlineLink?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  offlineAddress?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  capacity?: number;

  @Field(() => EventStatus, { nullable: true })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @Field(() => [CreateDescriptionBlockInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDescriptionBlockInput)
  @IsOptional()
  descriptionBlocks?: CreateDescriptionBlockInput[];

  @Field(() => [CreateEventPassInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventPassInput)
  @IsOptional()
  passes?: CreateEventPassInput[];

  @Field(() => [CreateEventCouponInput], { nullable: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventCouponInput)
  @IsOptional()
  coupons?: CreateEventCouponInput[];

  @Field(() => CreateEventPaymentSettingInput, { nullable: true })
  @ValidateNested()
  @Type(() => CreateEventPaymentSettingInput)
  @IsOptional()
  paymentSetting?: CreateEventPaymentSettingInput;
}
