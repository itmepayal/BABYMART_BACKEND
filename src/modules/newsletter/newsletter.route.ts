import { Router } from "express";
import {
  createNewsletterController,
  deleteNewsletterController,
  getAllNewslettersController,
  getNewsletterByIdController,
  unsubscribeNewsletterController,
  updateNewsletterController,
} from "./newsletter.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";

export const newsletterRouter = Router();

/* =========================
   Newsletter Management
========================= */
newsletterRouter.post("/", createNewsletterController);
newsletterRouter.post("/unsubscribe", unsubscribeNewsletterController);
newsletterRouter.get(
  "/",
  protect,
  authorize("admin"),
  getAllNewslettersController,
);
newsletterRouter.get(
  "/:newsletterId",
  protect,
  authorize("admin"),
  getNewsletterByIdController,
);
newsletterRouter.put(
  "/:newsletterId",
  protect,
  authorize("admin"),
  updateNewsletterController,
);
newsletterRouter.delete(
  "/:newsletterId",
  protect,
  authorize("admin"),
  deleteNewsletterController,
);
