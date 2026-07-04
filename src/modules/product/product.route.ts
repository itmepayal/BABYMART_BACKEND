import { Router } from "express";
import {
  getAllProductsController,
  getProductBySlugController,
  getRelatedProductsController,
} from "./product.controller";

export const productRouter = Router();

/* =========================
   Product Management
========================= */
productRouter.get("/", getAllProductsController);
productRouter.get("/slug/:slug", getProductBySlugController);
productRouter.get("/:productId/related", getRelatedProductsController);
