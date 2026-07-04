import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  editProductController,
  getAllProductsController,
  getProductByIdController,
} from "./vendor.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";

export const vendorRouter = Router();

/* =========================
   Vendor Management
========================= */
vendorRouter.use(protect, authorize("vendor"));
vendorRouter.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createProductController,
);
vendorRouter.get("/", getAllProductsController);
vendorRouter.get("/:productId", getProductByIdController);
vendorRouter.put(
  "/:productId",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  editProductController,
);
vendorRouter.patch(
  "/:productId",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  editProductController,
);
vendorRouter.delete("/:productId", deleteProductController);
