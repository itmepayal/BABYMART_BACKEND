import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../../types/express";
import { apiResponse } from "../../utils/response/app.response";
import {
  createContactService,
  getContactService,
  updateContactService,
} from "./contact.service";

/* =========================
   Contact Controllers
========================= */
export const createContactController = async (
  req: AuthRequest,
): Promise<void> => {
  const contact = await createContactService(req.body);
  apiResponse(
    req.res!,
    StatusCodes.CREATED,
    "Contact information saved successfully.",
    contact,
  );
};

export const getContactController = async (req: AuthRequest): Promise<void> => {
  const contact = await getContactService();
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Contact information fetched successfully.",
    contact,
  );
};

export const updateContactController = async (
  req: AuthRequest,
): Promise<void> => {
  const contact = await updateContactService(req.body);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Contact information updated successfully.",
    contact,
  );
};
