import { z } from "zod";

const storeLocationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Store location title must be at least 2 characters")
    .max(100, "Store location title cannot exceed 100 characters"),

  address: z
    .string()
    .trim()
    .min(5, "Store address must be at least 5 characters")
    .max(300, "Store address cannot exceed 300 characters"),
});

export const contactSchema = z.object({
  mapUrl: z.string().trim().url("Please enter a valid Google Map URL"),

  storeLocations: z
    .array(storeLocationSchema)
    .min(1, "At least one store location is required")
    .max(20, "Maximum 20 store locations are allowed"),

  mobile: z
    .string()
    .trim()
    .min(8, "Mobile number must be at least 8 digits")
    .max(20, "Mobile number cannot exceed 20 characters"),

  hotline: z
    .string()
    .trim()
    .min(8, "Hotline number must be at least 8 digits")
    .max(20, "Hotline number cannot exceed 20 characters"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),

  openingHours: z
    .string()
    .trim()
    .min(5, "Opening hours are required")
    .max(200, "Opening hours cannot exceed 200 characters"),
});

export const updateContactSchema = contactSchema.partial();

export type ContactInput = z.infer<typeof contactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
