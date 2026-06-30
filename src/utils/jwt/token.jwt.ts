import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { serverConfig } from "../../config";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

const ACCESS_SECRET: Secret = serverConfig.JWT_ACCESS_SECRET;
const REFRESH_SECRET: Secret = serverConfig.JWT_REFRESH_SECRET;

export const generateAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: serverConfig.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, ACCESS_SECRET, options);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: serverConfig.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};
