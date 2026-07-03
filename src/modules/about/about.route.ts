import { Router } from "express";
import {
  createAboutController,
  getAboutController,
  updateAboutController,
} from "./about.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";

export const aboutRouter = Router();

/* =========================
   About Management
========================= */
aboutRouter.get("/", getAboutController);
aboutRouter.post("/", protect, authorize("admin"), createAboutController);
aboutRouter.put("/", protect, authorize("admin"), updateAboutController);
