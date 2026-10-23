import { z } from "zod";

export const eventPassSchema = z.object({
  id: z.string(),
  pricing: z.enum(["FREE", "PAID"]),
  tier: z.enum(["GA", "VIP", "VVIP", "CUSTOM"]),
  customName: z.string().optional(),
  category: z.enum(["SINGLE", "GROUP"]),
  quantity: z.string().min(1, "Quantity is required").refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 0;
  }, "Quantity must be at least 1"),
  price: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.pricing === "PAID") {
    if (!data.price || isNaN(parseFloat(data.price)) || parseFloat(data.price) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["price"],
        message: "Price must be greater than 0",
      });
    }
  }
  if (data.tier === "CUSTOM" && (!data.customName || data.customName.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["customName"],
      message: "Custom name is required",
    });
  }
});

export const eventCouponSchema = z.object({
  id: z.string(),
  code: z.string().min(1, "Code is required"),
  discountType: z.enum(["PERCENTAGE", "AMOUNT"]),
  discountValue: z.string().min(1, "Discount value is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Must be greater than 0"),
}).superRefine((data, ctx) => {
  if (data.discountType === "PERCENTAGE" && parseFloat(data.discountValue) > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["discountValue"],
      message: "Cannot exceed 100%",
    });
  }
});

export const eventPassesFormSchema = z.object({
  passes: z.array(eventPassSchema).min(1, "At least one pass is required"),
  coupons: z.array(eventCouponSchema),
});
