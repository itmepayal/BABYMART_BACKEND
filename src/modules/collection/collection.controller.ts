import { StatusCodes } from "http-status-codes";
import { uploadToCloudinary } from "../../config/cloudinary.config";
import { AuthRequest } from "../../types/express";
import { BadRequestError } from "../../utils/errors/app.error";
import { apiResponse } from "../../utils/response/app.response";
import {
  createCollectionService,
  deleteCollectionService,
  getAllCollectionsService,
  getCollectionByIdService,
  updateCollectionService,
} from "./collection.service";

/* =========================
   Collection Controllers
========================= */

export const createCollectionController = async (
  req: AuthRequest,
): Promise<void> => {
  if (!req.file) {
    throw new BadRequestError("Collection image is required.");
  }
  const image = await uploadToCloudinary(req.file.path, "babymart/collections");
  const collection = await createCollectionService({
    ...req.body,
    image: image.url,
  });
  apiResponse(
    req.res!,
    StatusCodes.CREATED,
    "Collection created successfully.",
    collection,
  );
};

export const getAllCollectionsController = async (
  req: AuthRequest,
): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = String(req.query.search || "");
  const collections = await getAllCollectionsService(page, limit, search);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Collections fetched successfully.",
    collections,
  );
};

export const getCollectionByIdController = async (
  req: AuthRequest,
): Promise<void> => {
  const collection = await getCollectionByIdService(req.params.collectionId);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Collection fetched successfully.",
    collection,
  );
};

export const updateCollectionController = async (
  req: AuthRequest,
): Promise<void> => {
  const payload = { ...req.body };
  if (req.file) {
    const image = await uploadToCloudinary(
      req.file.path,
      "babymart/collections",
    );

    payload.image = image.url;
  }
  const collection = await updateCollectionService(
    req.params.collectionId,
    payload,
  );
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Collection updated successfully.",
    collection,
  );
};

export const deleteCollectionController = async (
  req: AuthRequest,
): Promise<void> => {
  await deleteCollectionService(req.params.collectionId);
  apiResponse(req.res!, StatusCodes.OK, "Collection deleted successfully.");
};
