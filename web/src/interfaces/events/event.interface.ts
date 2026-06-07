import { BlockType, PassPricing, PassTier } from '@/gql/graphql';
import { HeadingSize, ParagraphSize, PassCategory } from '@/types/events/event.type';

export interface DescriptionBlock {
  id: string;
  type: BlockType;
  content: string;
  level?: HeadingSize;
  textSize?: ParagraphSize;
  listStyle?: 'disc' | 'decimal';
}

export interface EventPass {
  id: string;
  pricing: PassPricing;
  tier: PassTier;
  customName: string;
  category: PassCategory;
  quantity: string;
  price: string;
}

export interface EventCoupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'AMOUNT';
  discountValue: string;
}
