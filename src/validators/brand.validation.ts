import { z } from "zod";

export const brandSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Brand title must be at least 2 characters")
    .max(50, "Brand title cannot exceed 50 characters"),

  image: z.string().trim().min(1, "Brand image is required"),
});

export const updateBrandSchema = brandSchema.partial();

export type BrandInput = z.infer<typeof brandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
