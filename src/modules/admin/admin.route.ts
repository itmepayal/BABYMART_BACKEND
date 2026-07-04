import { Router } from "express";
import {
  getAllUsersController,
  getUserByIdController,
  editUserRoleController,
  editUserStatusController,
  deleteUserController,
  toggleActiveController,
  toggleFeaturedController,
  rejectProductController,
  approveProductController,
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  editProductController,
} from "./admin.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";

export const adminRouter = Router();

adminRouter.use(protect, authorize("admin"));

/* =========================
   Admin User Management
========================= */
adminRouter.get("/users", getAllUsersController);
adminRouter.get("/users/:userId", getUserByIdController);
adminRouter.patch("/users/:userId/role", editUserRoleController);
adminRouter.patch("/users/:userId/status", editUserStatusController);
adminRouter.delete("/users/:userId", deleteUserController);

/* =========================
   Admin Product Management
========================= */
adminRouter.get("/products", getAllProductsController);
adminRouter.get("/products/:productId", getProductByIdController);
adminRouter.post(
  "/products",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createProductController,
);
adminRouter.patch(
  "/products/:productId",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  editProductController,
);
adminRouter.delete("/products/:productId", deleteProductController);
adminRouter.patch(
  "/products/:productId/approve",
  protect,
  authorize("admin"),
  approveProductController,
);
adminRouter.patch(
  "/products/:productId/reject",
  protect,
  authorize("admin"),
  rejectProductController,
);
adminRouter.patch(
  "/products/:productId/featured",
  protect,
  authorize("admin"),
  toggleFeaturedController,
);
adminRouter.patch(
  "/products/:productId/active",
  protect,
  authorize("admin"),
  toggleActiveController,
);
