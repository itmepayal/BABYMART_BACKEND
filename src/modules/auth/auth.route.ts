import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  getCurrentUser,
  changePasswordController,
  uploadAvatarController,
  deleteAccountController,
  addAddressController,
  getAddressesController,
  updateAddressController,
  deleteAddressController,
  setDefaultAddressController,
} from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";
import { validateRequestBody } from "../../validators";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  addressSchema,
  updateAddressSchema,
} from "../../validators/auth.validation";
import { upload } from "../../middlewares/multer.middleware";

export const authRouter = Router();

/* =========================
   Authentication
========================= */
authRouter.post(
  "/register",
  validateRequestBody(registerSchema),
  registerController,
);
authRouter.post("/login", validateRequestBody(loginSchema), loginController);
authRouter.post("/logout", protect, logoutController);
authRouter.get("/me", protect, getCurrentUser);
authRouter.patch(
  "/change-password",
  protect,
  validateRequestBody(changePasswordSchema),
  changePasswordController,
);
authRouter.patch(
  "/avatar",
  protect,
  upload.single("avatar"),
  uploadAvatarController,
);
authRouter.delete("/me", protect, deleteAccountController);

/* =========================
   Address Management
========================= */
authRouter.post(
  "/addresses",
  protect,
  validateRequestBody(addressSchema),
  addAddressController,
);
authRouter.get("/addresses", protect, getAddressesController);
authRouter.patch(
  "/addresses/:addressId",
  protect,
  validateRequestBody(updateAddressSchema),
  updateAddressController,
);
authRouter.delete("/addresses/:addressId", protect, deleteAddressController);
authRouter.patch(
  "/addresses/:addressId/default",
  protect,
  setDefaultAddressController,
);

export default authRouter;
