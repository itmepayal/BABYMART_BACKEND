import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../../types/express";
import { apiResponse } from "../../utils/response/app.response";
import {
  createNewsletterService,
  deleteNewsletterService,
  getAllNewslettersService,
  getNewsletterByIdService,
  unsubscribeNewsletterService,
  updateNewsletterService,
} from "./newsletter.service";

/* =========================
   Newsletter Controllers
========================= */

export const createNewsletterController = async (
  req: AuthRequest,
): Promise<void> => {
  const newsletter = await createNewsletterService(req.body);

  apiResponse(
    req.res!,
    StatusCodes.CREATED,
    "Newsletter subscription created successfully.",
    newsletter,
  );
};

export const getAllNewslettersController = async (
  req: AuthRequest,
): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = String(req.query.search || "");

  const newsletters = await getAllNewslettersService(page, limit, search);

  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Newsletters fetched successfully.",
    newsletters,
  );
};

export const getNewsletterByIdController = async (
  req: AuthRequest,
): Promise<void> => {
  const newsletter = await getNewsletterByIdService(req.params.newsletterId);

  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Newsletter fetched successfully.",
    newsletter,
  );
};

export const updateNewsletterController = async (
  req: AuthRequest,
): Promise<void> => {
  const newsletter = await updateNewsletterService(
    req.params.newsletterId,
    req.body,
  );

  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Newsletter updated successfully.",
    newsletter,
  );
};

export const unsubscribeNewsletterController = async (
  req: AuthRequest,
): Promise<void> => {
  const newsletter = await unsubscribeNewsletterService(req.body.email);

  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Newsletter unsubscribed successfully.",
    newsletter,
  );
};

export const deleteNewsletterController = async (
  req: AuthRequest,
): Promise<void> => {
  await deleteNewsletterService(req.params.newsletterId);

  apiResponse(req.res!, StatusCodes.OK, "Newsletter deleted successfully.");
};
