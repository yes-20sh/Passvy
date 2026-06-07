import { registerEnumType } from '@nestjs/graphql';

export enum EventMode {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
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

export enum PayoutMethod {
  BANK = 'BANK',
  UPI = 'UPI',
}

registerEnumType(EventMode, { name: 'EventMode' });
registerEnumType(EventStatus, { name: 'EventStatus' });
registerEnumType(BlockType, { name: 'BlockType' });
registerEnumType(PassPricing, { name: 'PassPricing' });
registerEnumType(PassTier, { name: 'PassTier' });
registerEnumType(DiscountType, { name: 'DiscountType' });
registerEnumType(PayoutMethod, { name: 'PayoutMethod' });
