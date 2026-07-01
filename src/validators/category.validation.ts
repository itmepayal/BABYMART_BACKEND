import { z } from "zod";

export const createCategorySchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters.")
    .max(50, "Category name cannot exceed 50 characters.")
    .transform((value) => value.replace(/\s+/g, " ")),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
