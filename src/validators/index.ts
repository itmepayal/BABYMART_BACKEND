import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import logger from "../config/logger.config";

export const validateRequestBody = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("Validating request body");
      req.body = await schema.parseAsync(req.body);
      logger.info("Request body is valid");
      next();
    } catch (error) {
      logger.error("Request body is invalid");
      next(error);
    }
  };
};

export const validateQueryParams = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = await schema.parseAsync(req.query);
      logger.info("Query params are valid");
      next();
    } catch (error) {
      logger.error("Query params are invalid");
      next(error);
    }
  };
};
