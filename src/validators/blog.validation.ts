import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z
  .string()
  .trim()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid author id",
  });

export const createBlogPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title cannot exceed 200 characters")
    .transform((value) => value.replace(/\s+/g, " ")),

  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag cannot be empty")
        .max(30, "Tag cannot exceed 30 characters")
        .transform((tag) => tag.toLowerCase()),
    )
    .max(20, "Maximum 20 tags are allowed")
    .default([]),

  author: objectIdSchema,

  excerpt: z
    .string()
    .trim()
    .min(20, "Excerpt must be at least 20 characters")
    .max(500, "Excerpt cannot exceed 500 characters")
    .transform((value) => value.replace(/\s+/g, " ")),

  body: z
    .string()
    .trim()
    .min(50, "Body must be at least 50 characters")
    .max(100000, "Body is too large"),

  isPublished: z.preprocess((value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  }, z.boolean()),

  publishedAt: z.coerce.date().optional(),
});

export const updateBlogPostSchema = createBlogPostSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });

export const blogPostIdSchema = z.object({
  blogPostId: objectIdSchema,
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type BlogPostIdInput = z.infer<typeof blogPostIdSchema>;
