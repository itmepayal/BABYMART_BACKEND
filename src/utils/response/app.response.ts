import { Response } from "express";
import { getReasonPhrase } from "http-status-codes";

export class ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;

  constructor(statusCode: number, message?: string, data?: T) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message ?? this.getDefaultMessage(statusCode);
    this.data = data;
  }

  private getDefaultMessage(statusCode: number): string {
    try {
      return getReasonPhrase(statusCode);
    } catch {
      return "Unknown Status";
    }
  }
}

export const apiResponse = <T>(
  res: Response,
  statusCode: number,
  message?: string,
  data?: T,
) => {
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, message, data));
};
