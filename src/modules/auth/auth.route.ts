import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
} from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";
import { validateRequestBody } from "../../validators";
import { registerSchema, loginSchema } from "../../validators/auth.validation";

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
authRouter.post("/refresh-token", protect, refreshTokenController);

export default authRouter;
