import { z } from "zod";
import { Types } from "mongoose";

const objectIdSchema = z.string().refine((id) => Types.ObjectId.isValid(id), {
  message: "Invalid ObjectId",
});

export const offerSchema = z.object({
  icon: z.enum(["shipping", "membership", "safe", "returns"]),
  label: z
    .string()
    .trim()
    .min(2, "Offer label must be at least 2 characters")
    .max(100, "Offer label cannot exceed 100 characters"),
});
export const badgeSchema = z.object({
  label: z
    .string()
    .trim()
    .max(50, "Badge label cannot exceed 50 characters")
    .optional(),
  tone: z.enum(["", "new", "sale", "hot", "bestseller"]).default(""),
});

export const countdownSchema = z.object({
  enabled: z.boolean().default(false),
  endsAt: z.coerce.date().optional(),
});

const productSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  oldPrice: z.coerce.number().positive().optional(),
  rating: z.coerce.number().min(0).max(5).default(0),
  reviews: z.coerce.number().int().min(0).default(0),
  reviewCount: z.coerce.number().int().min(0).default(0),
  sold: z.coerce.number().int().min(0).default(0),
  badge: badgeSchema.optional(),
  discountBadge: z.string().trim().max(50).optional(),
  inStock: z.boolean().default(true),
  stockQuantity: z.coerce.number().int().min(0).default(100),
  productType: z.string().trim().max(50).optional(),
  vendor: objectIdSchema,
  code: z.string().trim().max(50).optional(),
  categories: z
    .array(objectIdSchema)
    .min(1, "At least one category is required"),
  collections: z.array(objectIdSchema).default([]),
  tags: z.array(z.string().trim().min(1).max(50)).default([]),
  offers: z.array(offerSchema).default([]),
  description: z.string().trim().max(5000).default(""),
  weight: z.string().trim().max(50).optional(),
  dimensions: z.string().trim().max(100).optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  countdown: countdownSchema.default({
    enabled: false,
  }),
});

export const createProductSchema = productSchema;
export const updateProductSchema = productSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type OfferInput = z.infer<typeof offerSchema>;
export type BadgeInput = z.infer<typeof badgeSchema>;
export type CountdownInput = z.infer<typeof countdownSchema>;
