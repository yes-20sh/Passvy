export type BlockType = "heading" | "paragraph" | "image" | "list";
export type PassPricing = "FREE" | "PAID";
export type PassTier = "GA" | "VIP" | "VVIP" | "CUSTOM";
export type PassCategory = "SINGLE" | "FRIEND" | "GROUP";
export type HeadingSize = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type ParagraphSize = "sm" | "base" | "lg";

export interface DescriptionBlock {
  id: string;
  type: BlockType;
  content: string;
  level?: HeadingSize;
  textSize?: ParagraphSize;
  listStyle?: "disc" | "decimal";
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
  discountPercentage: string;
}
