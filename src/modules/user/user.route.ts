import { Router } from "express";
import {
  getCurrentUser,
  changePasswordController,
  uploadAvatarController,
  deleteAccountController,
  addAddressController,
  getAddressesController,
  updateAddressController,
  deleteAddressController,
  setDefaultAddressController,
} from "./user.controller";
import { protect } from "../../middlewares/auth.middleware";
import { validateRequestBody } from "../../validators";
import {
  changePasswordSchema,
  addressSchema,
  updateAddressSchema,
} from "../../validators/auth.validation";
import { upload } from "../../middlewares/multer.middleware";

export const userRouter = Router();

/* =========================
   Users
========================= */
userRouter.get("/me", protect, getCurrentUser);
userRouter.patch(
  "/change-password",
  protect,
  validateRequestBody(changePasswordSchema),
  changePasswordController,
);
userRouter.patch(
  "/avatar",
  protect,
  upload.single("avatar"),
  uploadAvatarController,
);
userRouter.delete("/me", protect, deleteAccountController);

/* =========================
   Address Management
========================= */
userRouter.post(
  "/addresses",
  protect,
  validateRequestBody(addressSchema),
  addAddressController,
);
userRouter.get("/addresses", protect, getAddressesController);
userRouter.patch(
  "/addresses/:addressId",
  protect,
  validateRequestBody(updateAddressSchema),
  updateAddressController,
);
userRouter.delete("/addresses/:addressId", protect, deleteAddressController);
userRouter.patch(
  "/addresses/:addressId/default",
  protect,
  setDefaultAddressController,
);
