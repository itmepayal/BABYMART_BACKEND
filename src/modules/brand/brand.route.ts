import { Router } from "express";
import {
  createBrandController,
  deleteBrandController,
  getAllBrandsController,
  getBrandByIdController,
  updateBrandController,
} from "./brand.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";

export const brandRouter = Router();

/* =========================
   Brand Management
========================= */
brandRouter.get("/", getAllBrandsController);
brandRouter.get("/:brandId", getBrandByIdController);
brandRouter.post(
  "/",
  protect,
  authorize("admin"),
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  createBrandController,
);
brandRouter.put(
  "/:brandId",
  protect,
  authorize("admin"),
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  updateBrandController,
);
brandRouter.delete(
  "/:brandId",
  protect,
  authorize("admin"),
  deleteBrandController,
);
