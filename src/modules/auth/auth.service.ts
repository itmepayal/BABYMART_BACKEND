import User from "../../models/user.model";
import { ConflictError, UnauthorizedError } from "../../utils/errors/app.error";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt/token.jwt";
import { LoginInput, RegisterInput } from "../../validators/auth.validation";

/* =========================
   Authentication Services
========================= */
export const registerService = async (data: RegisterInput) => {
  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    throw new ConflictError("Email already exists");
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
  });

  return user;
};

export const loginService = async (data: LoginInput) => {
  const user = await User.findOne({
    email: data.email,
  }).select("+password");

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  if (!user.isActive) {
    throw new UnauthorizedError("Your account has been deactivated.");
  }

  const isPasswordMatched = await user.matchPassword(data.password);

  if (!isPasswordMatched) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.password = undefined as never;

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const logoutService = async (userId: string) => {
  await User.findByIdAndUpdate(userId, {
    refreshToken: null,
  });
};

export const refreshTokenService = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken) as {
    id: string;
    email: string;
    role: string;
  };
  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user) {
    throw new UnauthorizedError("User not found.");
  }
  if (!user.refreshToken || user.refreshToken !== refreshToken) {
    throw new UnauthorizedError("Invalid refresh token.");
  }
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  const accessToken = generateAccessToken(payload);
  return {
    accessToken,
  };
};
