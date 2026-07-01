import { z } from "zod";

const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "Coupon code must be at least 3 characters")
    .max(30, "Coupon code cannot exceed 30 characters")
    .transform((value) => value.toUpperCase()),
  discountType: z.enum(["percent", "flat"]),
  discountValue: z.number().positive("Discount value must be greater than 0"),
  minOrderAmount: z.number().min(0).default(0),
  maxDiscountAmount: z.number().positive().optional(),
  expiresAt: z.coerce.date().optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().default(true),
});

export const createCouponSchema = couponSchema.superRefine((data, ctx) => {
  if (
    data.discountType === "percent" &&
    (data.discountValue <= 0 || data.discountValue > 100)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["discountValue"],
      message: "Percentage discount must be between 1 and 100.",
    });
  }

  if (data.discountType === "flat" && data.maxDiscountAmount !== undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["maxDiscountAmount"],
      message:
        "Maximum discount amount should not be provided for flat discounts.",
    });
  }

  if (data.expiresAt && data.expiresAt <= new Date()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["expiresAt"],
      message: "Expiry date must be in the future.",
    });
  }
});

export const updateCouponSchema = couponSchema
  .partial()
  .superRefine((data, ctx) => {
    if (
      data.discountType === "percent" &&
      data.discountValue !== undefined &&
      (data.discountValue <= 0 || data.discountValue > 100)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountValue"],
        message: "Percentage discount must be between 1 and 100.",
      });
    }
  });

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
