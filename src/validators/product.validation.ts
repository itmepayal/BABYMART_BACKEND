import { z } from "zod";
import { Types } from "mongoose";

const objectIdSchema = z.string().refine(Types.ObjectId.isValid, {
  message: "Invalid ObjectId",
});

export const offerSchema = z.object({
  icon: z.enum(["shipping", "membership", "safe", "returns"]),
  label: z.string().trim().min(2).max(100),
});

export const badgeSchema = z.object({
  label: z.string().trim().max(50).optional(),
  tone: z.enum(["", "new", "sale", "hot", "bestseller"]).default(""),
});

export const countdownSchema = z
  .object({
    enabled: z.boolean().default(false),
    endsAt: z.coerce.date().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.enabled && !value.endsAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endsAt"],
        message: "Countdown end date is required.",
      });
    }
    if (value.enabled && value.endsAt && value.endsAt <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endsAt"],
        message: "Countdown end date must be in the future.",
      });
    }
  });

const productBaseSchema = z.object({
  title: z
    .string({
      required_error: "Product title is required",
    })
    .trim()
    .min(3, "Title must contain at least 3 characters.")
    .max(150, "Title cannot exceed 150 characters."),
  price: z.coerce
    .number({
      invalid_type_error: "Price must be a number.",
    })
    .positive("Price must be greater than 0.")
    .max(10000000),
  oldPrice: z.coerce
    .number()
    .positive("Old price must be greater than 0.")
    .max(10000000)
    .optional(),
  rating: z.coerce.number().min(0).max(5).default(0),
  reviews: z.coerce.number().int().min(0).max(10000000).default(0),
  reviewCount: z.coerce.number().int().min(0).max(10000000).default(0),
  sold: z.coerce.number().int().min(0).max(100000000).default(0),
  badge: badgeSchema.optional(),
  discountBadge: z.string().trim().min(2).max(50).optional(),
  inStock: z.boolean().default(true),
  stockQuantity: z.coerce.number().int().min(0).max(1000000).default(0),
  productType: z.string().trim().min(2).max(50).optional(),
  vendor: objectIdSchema,
  code: z
    .string()
    .trim()
    .min(3)
    .max(50)
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Only letters, numbers, hyphen and underscore are allowed.",
    )
    .optional(),
  categories: z
    .array(objectIdSchema)
    .min(1, "Select at least one category.")
    .max(20)
    .transform((v) => [...new Set(v)]),
  collections: z
    .array(objectIdSchema)
    .max(20)
    .default([])
    .transform((v) => [...new Set(v)]),
  tags: z
    .array(z.string().trim().min(1).max(50))
    .max(50)
    .default([])
    .transform((v) => [...new Set(v)]),
  offers: z.array(offerSchema).max(10).default([]),
  description: z.string().trim().max(5000).default(""),
  weight: z
    .string()
    .trim()
    .regex(/^\d+(\.\d+)?\s?(g|kg)$/i, "Example: 500g or 2kg")
    .optional(),
  dimensions: z
    .string()
    .trim()
    .regex(/^\d+(\.\d+)?x\d+(\.\d+)?x\d+(\.\d+)?$/i, "Example: 20x15x10")
    .optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  countdown: countdownSchema.default({
    enabled: false,
  }),
});

export const createProductSchema = productBaseSchema.superRefine(
  (data, ctx) => {
    if (data.oldPrice !== undefined && data.oldPrice < data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["oldPrice"],
        message: "Old price must be greater than or equal to price.",
      });
    }

    if (data.inStock && data.stockQuantity <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["stockQuantity"],
        message: "Stock quantity must be greater than 0.",
      });
    }

    if (!data.inStock && data.stockQuantity > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["stockQuantity"],
        message: "Out of stock products cannot have stock quantity.",
      });
    }

    if (data.rating > 0 && data.reviewCount === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reviewCount"],
        message: "Review count must be greater than 0 if rating exists.",
      });
    }

    if (data.reviews !== data.reviewCount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reviews"],
        message: "Reviews and reviewCount should match.",
      });
    }
  },
);

export const updateProductSchema = productBaseSchema.partial();
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type OfferInput = z.infer<typeof offerSchema>;
export type BadgeInput = z.infer<typeof badgeSchema>;
export type CountdownInput = z.infer<typeof countdownSchema>;
