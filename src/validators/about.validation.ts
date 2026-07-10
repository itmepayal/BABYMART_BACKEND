import { z } from "zod";

const founderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Founder name must be at least 2 characters")
    .max(100, "Founder name cannot exceed 100 characters"),

  designation: z
    .string()
    .trim()
    .min(2, "Designation must be at least 2 characters")
    .max(100, "Designation cannot exceed 100 characters"),

  image: z.string().trim().min(1, "Founder image is required"),
});

const featureSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Feature title must be at least 2 characters")
    .max(100, "Feature title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Feature description must be at least 10 characters")
    .max(500, "Feature description cannot exceed 500 characters"),
});

export const aboutSchema = z.object({
  heroTitle: z
    .string()
    .trim()
    .min(2, "Hero title must be at least 2 characters")
    .max(150, "Hero title cannot exceed 150 characters"),

  heroDescription: z
    .string()
    .trim()
    .min(20, "Hero description must be at least 20 characters")
    .max(2000, "Hero description cannot exceed 2000 characters"),

  heroImage: z.string().trim().min(1, "Hero image is required"),

  quote: z
    .string()
    .trim()
    .min(5, "Quote must be at least 5 characters")
    .max(500, "Quote cannot exceed 500 characters"),

  quoteAuthor: z
    .string()
    .trim()
    .min(2, "Quote author is required")
    .max(100, "Quote author cannot exceed 100 characters"),

  sectionTitle: z
    .string()
    .trim()
    .min(2, "Section title must be at least 2 characters")
    .max(150, "Section title cannot exceed 150 characters"),

  sectionDescription: z
    .string()
    .trim()
    .min(20, "Section description must be at least 20 characters")
    .max(2000, "Section description cannot exceed 2000 characters"),

  sectionImage: z.string().trim().min(1, "Section image is required"),

  features: z
    .array(featureSchema)
    .min(1, "At least one feature is required")
    .max(10, "Maximum 10 features are allowed"),

  founders: z
    .array(founderSchema)
    .min(1, "At least one founder is required")
    .max(10, "Maximum 10 founders are allowed"),

  clientLogos: z.array(z.string().trim().min(1)).default([]),
});

export type AboutInput = z.infer<typeof aboutSchema>;
