import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),
  isSubscribed: z.boolean().default(true),
  subscribedAt: z.coerce.date().optional(),
  unsubscribedAt: z.coerce.date().optional(),
});

export const updateNewsletterSchema = newsletterSchema.partial();

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type UpdateNewsletterInput = z.infer<typeof updateNewsletterSchema>;
