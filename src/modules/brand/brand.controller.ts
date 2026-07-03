import { StatusCodes } from "http-status-codes";
import { uploadToCloudinary } from "../../config/cloudinary.config";
import { AuthRequest } from "../../types/express";
import { BadRequestError } from "../../utils/errors/app.error";
import { apiResponse } from "../../utils/response/app.response";

import {
  createBrandService,
  deleteBrandService,
  getAllBrandsService,
  getBrandByIdService,
  updateBrandService,
} from "./brand.service";

/* =========================
   Brand Controllers
========================= */

export const createBrandController = async (
  req: AuthRequest,
): Promise<void> => {
  const files = req.files as {
    image?: Express.Multer.File[];
  };

  if (!files?.image?.length) {
    throw new BadRequestError("Brand image is required.");
  }

  const uploaded = await uploadToCloudinary(
    files.image[0].path,
    "babymart/brands",
  );

  const brand = await createBrandService({
    ...req.body,
    image: uploaded.url,
  });

  apiResponse(
    req.res!,
    StatusCodes.CREATED,
    "Brand created successfully.",
    brand,
  );
};

export const getAllBrandsController = async (
  req: AuthRequest,
): Promise<void> => {
  const brands = await getAllBrandsService(
    Number(req.query.page) || 1,
    Number(req.query.limit) || 10,
    String(req.query.search || ""),
  );

  apiResponse(req.res!, StatusCodes.OK, "Brands fetched successfully.", brands);
};

export const getBrandByIdController = async (
  req: AuthRequest,
): Promise<void> => {
  const brand = await getBrandByIdService(req.params.brandId);

  apiResponse(req.res!, StatusCodes.OK, "Brand fetched successfully.", brand);
};

export const updateBrandController = async (
  req: AuthRequest,
): Promise<void> => {
  const files = req.files as {
    image?: Express.Multer.File[];
  };

  const payload: Record<string, any> = {
    ...req.body,
  };

  if (files?.image?.length) {
    const uploaded = await uploadToCloudinary(
      files.image[0].path,
      "babymart/brands",
    );

    payload.image = uploaded.url;
  }

  const brand = await updateBrandService(req.params.brandId, payload);

  apiResponse(req.res!, StatusCodes.OK, "Brand updated successfully.", brand);
};

export const deleteBrandController = async (
  req: AuthRequest,
): Promise<void> => {
  await deleteBrandService(req.params.brandId);

  apiResponse(req.res!, StatusCodes.OK, "Brand deleted successfully.");
};
