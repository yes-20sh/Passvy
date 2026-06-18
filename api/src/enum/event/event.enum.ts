import { registerEnumType } from '@nestjs/graphql';

export enum EventMode {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export enum EventStep {
  ESSENTIALS = 'ESSENTIALS',
  DESCRIPTION = 'DESCRIPTION',
  MODE = 'MODE',
  PASSES = 'PASSES',
  PAYOUTS = 'PAYOUTS',
}

export enum EventRelation {
  MODE = 'mode',
  DESCRIPTION_BLOCKS = 'descriptionBlocks',
  PASSES = 'passes',
  COUPONS = 'coupons',
  PAYMENT_SETTING = 'paymentSetting',
}

export enum BlockType {
  HEADING = 'heading',
  PARAGRAPH = 'paragraph',
  LIST = 'list',
  IMAGE = 'image',
}

export enum PassPricing {
  FREE = 'FREE',
  PAID = 'PAID',
}

export enum PassTier {
  GA = 'GA',
  VIP = 'VIP',
  VVIP = 'VVIP',
  CUSTOM = 'CUSTOM',
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  AMOUNT = 'AMOUNT',
}

export enum PromotionDuration {
  ONE_DAY = '1-day',
  ONE_WEEK = '1-week',
}

export enum PromotionImageSource {
  HEADER = 'header',
  UPLOAD = 'upload',
}

registerEnumType(EventMode, { name: 'EventMode' });
registerEnumType(EventStatus, { name: 'EventStatus' });
registerEnumType(BlockType, { name: 'BlockType' });
registerEnumType(PassPricing, { name: 'PassPricing' });
registerEnumType(PassTier, { name: 'PassTier' });
registerEnumType(DiscountType, { name: 'DiscountType' });
registerEnumType(EventStep, { name: 'EventStep' });
registerEnumType(PromotionDuration, { name: 'PromotionDuration' });
registerEnumType(PromotionImageSource, { name: 'PromotionImageSource' });
