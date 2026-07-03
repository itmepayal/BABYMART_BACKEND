import { z } from "zod";

export const bannerSchema = z.object({
  images: z
    .array(z.string().trim().min(1, "Banner image is required"))
    .min(1, "At least one banner image is required")
    .max(10, "Maximum 10 banner images are allowed"),
  subBannerOne: z.string().trim().min(1, "Sub Banner One image is required"),
  subBannerTwo: z.string().trim().min(1, "Sub Banner Two image is required"),
});

export type BannerInput = z.infer<typeof bannerSchema>;
