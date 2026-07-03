import { StatusCodes } from "http-status-codes";
import { uploadToCloudinary } from "../../config/cloudinary.config";
import { AuthRequest } from "../../types/express";
import { apiResponse } from "../../utils/response/app.response";
import { aboutSchema } from "../../validators/about.validation";
import {
  createAboutService,
  getAboutService,
  updateAboutService,
} from "./about.service";

/* =========================
   Create About
========================= */
export const createAboutController = async (
  req: AuthRequest,
): Promise<void> => {
  const files = req.files as {
    heroImage?: Express.Multer.File[];
    sectionImage?: Express.Multer.File[];
    clientLogos?: Express.Multer.File[];
  };
  let heroImage = "";
  let sectionImage = "";
  const clientLogos: string[] = [];
  if (files?.heroImage?.length) {
    const uploaded = await uploadToCloudinary(
      files.heroImage[0].path,
      "babymart/about",
    );
    heroImage = uploaded.url;
  }
  if (files?.sectionImage?.length) {
    const uploaded = await uploadToCloudinary(
      files.sectionImage[0].path,
      "babymart/about",
    );
    sectionImage = uploaded.url;
  }
  if (files?.clientLogos?.length) {
    for (const file of files.clientLogos) {
      const uploaded = await uploadToCloudinary(file.path, "babymart/about");

      clientLogos.push(uploaded.url);
    }
  }
  const payload = aboutSchema.parse({
    ...req.body,
    heroImage,
    sectionImage,
    clientLogos,
    features: JSON.parse(req.body.features),
    founders: JSON.parse(req.body.founders),
  });
  const about = await createAboutService(payload);
  apiResponse(
    req.res!,
    StatusCodes.CREATED,
    "About page created successfully.",
    about,
  );
};

/* =========================
   Get About
========================= */

export const getAboutController = async (req: AuthRequest): Promise<void> => {
  const about = await getAboutService();
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "About page fetched successfully.",
    about,
  );
};

/* =========================
   Update About
========================= */
export const updateAboutController = async (
  req: AuthRequest,
): Promise<void> => {
  const files = req.files as {
    heroImage?: Express.Multer.File[];
    sectionImage?: Express.Multer.File[];
    clientLogos?: Express.Multer.File[];
  };
  const payload: Record<string, any> = {
    ...req.body,
  };
  if (files?.heroImage?.length) {
    const uploaded = await uploadToCloudinary(
      files.heroImage[0].path,
      "babymart/about",
    );
    payload.heroImage = uploaded.url;
  }
  if (files?.sectionImage?.length) {
    const uploaded = await uploadToCloudinary(
      files.sectionImage[0].path,
      "babymart/about",
    );
    payload.sectionImage = uploaded.url;
  }
  if (files?.clientLogos?.length) {
    payload.clientLogos = [];
    for (const file of files.clientLogos) {
      const uploaded = await uploadToCloudinary(file.path, "babymart/about");
      payload.clientLogos.push(uploaded.url);
    }
  }
  if (req.body.features) {
    payload.features = JSON.parse(req.body.features);
  }
  if (req.body.founders) {
    payload.founders = JSON.parse(req.body.founders);
  }
  const validated = aboutSchema.parse(payload);
  const about = await updateAboutService(validated);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "About page updated successfully.",
    about,
  );
};
