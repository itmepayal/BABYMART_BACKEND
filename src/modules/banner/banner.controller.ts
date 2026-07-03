import { StatusCodes } from "http-status-codes";
import { uploadToCloudinary } from "../../config/cloudinary.config";
import { AuthRequest } from "../../types/express";
import { apiResponse } from "../../utils/response/app.response";
import { bannerSchema } from "../../validators/banner.validation";
import {
  createBannerService,
  getBannerService,
  updateBannerService,
} from "./banner.service";

/* =========================
   Create Banner
========================= */
export const createBannerController = async (
  req: AuthRequest,
): Promise<void> => {
  const files = req.files as {
    images?: Express.Multer.File[];
    subBannerOne?: Express.Multer.File[];
    subBannerTwo?: Express.Multer.File[];
  };
  const images: string[] = [];
  let subBannerOne = "";
  let subBannerTwo = "";
  if (files?.images?.length) {
    for (const file of files.images) {
      const uploaded = await uploadToCloudinary(file.path, "babymart/banners");
      images.push(uploaded.url);
    }
  }
  if (files?.subBannerOne?.length) {
    const uploaded = await uploadToCloudinary(
      files.subBannerOne[0].path,
      "babymart/banners",
    );

    subBannerOne = uploaded.url;
  }
  if (files?.subBannerTwo?.length) {
    const uploaded = await uploadToCloudinary(
      files.subBannerTwo[0].path,
      "babymart/banners",
    );
    subBannerTwo = uploaded.url;
  }
  const payload = bannerSchema.parse({
    ...req.body,
    images,
    subBannerOne,
    subBannerTwo,
  });

  const banner = await createBannerService(payload);
  apiResponse(
    req.res!,
    StatusCodes.CREATED,
    "Banner saved successfully.",
    banner,
  );
};

/* =========================
   Get Banner
========================= */
export const getBannerController = async (req: AuthRequest): Promise<void> => {
  const banner = await getBannerService();
  apiResponse(req.res!, StatusCodes.OK, "Banner fetched successfully.", banner);
};

/* =========================
   Update Banner
========================= */
export const updateBannerController = async (
  req: AuthRequest,
): Promise<void> => {
  const files = req.files as {
    images?: Express.Multer.File[];
    subBannerOne?: Express.Multer.File[];
    subBannerTwo?: Express.Multer.File[];
  };
  const payload: Record<string, any> = {
    ...req.body,
  };
  if (files?.images?.length) {
    payload.images = [];
    for (const file of files.images) {
      const uploaded = await uploadToCloudinary(file.path, "babymart/banners");
      payload.images.push(uploaded.url);
    }
  }
  if (files?.subBannerOne?.length) {
    const uploaded = await uploadToCloudinary(
      files.subBannerOne[0].path,
      "babymart/banners",
    );
    payload.subBannerOne = uploaded.url;
  }
  if (files?.subBannerTwo?.length) {
    const uploaded = await uploadToCloudinary(
      files.subBannerTwo[0].path,
      "babymart/banners",
    );
    payload.subBannerTwo = uploaded.url;
  }
  const validated = bannerSchema.parse(payload);
  const banner = await updateBannerService(validated);
  apiResponse(req.res!, StatusCodes.OK, "Banner updated successfully.", banner);
};
