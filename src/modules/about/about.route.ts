import { Router } from "express";
import {
  createAboutController,
  getAboutController,
  updateAboutController,
} from "./about.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";

export const aboutRouter = Router();

/* =========================
   About Management
========================= */
aboutRouter.get("/", getAboutController);
aboutRouter.post(
  "/",
  protect,
  authorize("admin"),
  upload.fields([
    {
      name: "heroImage",
      maxCount: 1,
    },
    {
      name: "sectionImage",
      maxCount: 1,
    },
    {
      name: "clientLogos",
      maxCount: 20,
    },
    {
      name: "founderImages",
      maxCount: 10,
    },
  ]),
  createAboutController,
);
aboutRouter.put(
  "/",
  protect,
  authorize("admin"),
  upload.fields([
    {
      name: "heroImage",
      maxCount: 1,
    },
    {
      name: "sectionImage",
      maxCount: 1,
    },
    {
      name: "clientLogos",
      maxCount: 20,
    },
    {
      name: "founderImages",
      maxCount: 10,
    },
  ]),
  updateAboutController,
);
