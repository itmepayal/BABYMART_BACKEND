import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt/token.jwt";
import { ForbiddenError, UnauthorizedError } from "../utils/errors/app.error";
import { AuthRequest } from "../types/express";

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Not authorized");
  }
  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token) as {
    id: string;
    email: string;
    role: string;
  };
  req.user = payload;
  next();
};

export const authorize =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("Not authorized.");
    }
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("You are not allowed to access this resource.");
    }
    next();
  };
