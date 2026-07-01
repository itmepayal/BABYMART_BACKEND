import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z
  .string()
  .trim()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid category ID.",
  });

export const createCollectionSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Collection name must be at least 2 characters.")
    .max(100, "Collection name cannot exceed 100 characters.")
    .transform((value) => value.replace(/\s+/g, " ")),

  tint: z
    .enum([
      "bg-coral-50",
      "bg-blue-50",
      "bg-pink-50",
      "bg-amber-50",
      "bg-green-50",
      "bg-teal-50",
      "bg-purple-50",
    ])
    .optional(),

  categories: z
    .array(objectIdSchema)
    .min(1, "At least one category is required.")
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "Duplicate categories are not allowed.",
    ),
});
export const updateCollectionSchema = createCollectionSchema.partial();

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
