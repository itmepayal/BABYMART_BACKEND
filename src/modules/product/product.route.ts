import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  getProductBySlugController,
  updateProductController,
} from "./product.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";

export const productRouter = Router();

/* =========================
   Product Management
========================= */
productRouter.get("/", getAllProductsController);
productRouter.get("/slug/:slug", getProductBySlugController);
productRouter.get("/:productId", getProductByIdController);
productRouter.post(
  "/",
  protect,
  authorize("admin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createProductController,
);
productRouter.patch(
  "/:productId",
  protect,
  authorize("admin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateProductController,
);
productRouter.delete(
  "/:productId",
  protect,
  authorize("admin"),
  deleteProductController,
);
