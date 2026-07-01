import { Router } from "express";
import {
  getAllUsersController,
  getUserByIdController,
  updateUserRoleController,
  updateUserStatusController,
  deleteUserController,
} from "./admin.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";

export const adminRouter = Router();

/* =========================
   Admin User Management
========================= */
adminRouter.get("/users", protect, authorize("admin"), getAllUsersController);
adminRouter.get(
  "/users/:userId",
  protect,
  authorize("admin"),
  getUserByIdController,
);
adminRouter.patch(
  "/users/:userId/role",
  protect,
  authorize("admin"),
  updateUserRoleController,
);
adminRouter.patch(
  "/users/:userId/status",
  protect,
  authorize("admin"),
  updateUserStatusController,
);
adminRouter.delete(
  "/users/:userId",
  protect,
  authorize("admin"),
  deleteUserController,
);
