import { Router } from "express";
import {
  createBannerController,
  getBannerController,
  updateBannerController,
} from "./banner.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";

export const bannerRouter = Router();

/* =========================
   Banner Management
========================= */
bannerRouter.get("/", getBannerController);
bannerRouter.post(
  "/",
  protect,
  authorize("admin"),
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "subBannerOne",
      maxCount: 1,
    },
    {
      name: "subBannerTwo",
      maxCount: 1,
    },
  ]),
  createBannerController,
);
bannerRouter.put(
  "/",
  protect,
  authorize("admin"),
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "subBannerOne",
      maxCount: 1,
    },
    {
      name: "subBannerTwo",
      maxCount: 1,
    },
  ]),
  updateBannerController,
);
