import { Router } from "express";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "./category.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";
export const categoryRouter = Router();

/* =========================
   Category Management
========================= */
categoryRouter.get("/", getAllCategoriesController);
categoryRouter.get("/:categoryId", getCategoryByIdController);
categoryRouter.post("/", protect, authorize("admin"), createCategoryController);
categoryRouter.patch(
  "/:categoryId",
  protect,
  authorize("admin"),
  updateCategoryController,
);
categoryRouter.delete(
  "/:categoryId",
  protect,
  authorize("admin"),
  deleteCategoryController,
);
