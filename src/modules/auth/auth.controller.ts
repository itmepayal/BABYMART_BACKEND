import { Request } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../../types/express";
import {
  loginService,
  logoutService,
  registerService,
  refreshTokenService,
} from "./auth.service";
import {
  BadRequestError,
  UnauthorizedError,
} from "../../utils/errors/app.error";
import { apiResponse } from "../../utils/response/app.response";

/* =========================
   Authentication Controllers
========================= */
export const registerController = async (req: Request): Promise<void> => {
  const result = await registerService(req.body);
  apiResponse(
    req.res!,
    StatusCodes.CREATED,
    "User registered successfully.",
    result,
  );
};

export const loginController = async (req: Request): Promise<void> => {
  const result = await loginService(req.body);
  apiResponse(req.res!, StatusCodes.OK, "Login successful.", result);
};

export const logoutController = async (req: AuthRequest): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError("User is not authenticated.");
  }
  await logoutService(req.user.id);
  apiResponse(req.res!, StatusCodes.OK, "Logged out successfully");
};

export const refreshTokenController = async (req: Request): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new BadRequestError("Refresh token is required.");
  }

  const result = await refreshTokenService(refreshToken);

  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Access token refreshed successfully.",
    result,
  );
};
