import { StatusCodes } from "http-status-codes";
import { uploadToCloudinary } from "../../config/cloudinary.config";
import { AuthRequest } from "../../types/express";
import { BadRequestError } from "../../utils/errors/app.error";
import { apiResponse } from "../../utils/response/app.response";
import {
  createProductService,
  deleteProductService,
  editProductService,
  getAllProductsService,
  getProductByIdService,
} from "./vendor.service";

/* =========================
  Product Controllers
========================= */
export const createProductController = async (
  req: AuthRequest,
): Promise<void> => {
  const vendorId = req.user!.id;
  const files = req.files as {
    image?: Express.Multer.File[];
    images?: Express.Multer.File[];
  };
  if (!files?.image?.length) {
    throw new BadRequestError("Product image is required.");
  }
  const mainImage = await uploadToCloudinary(
    files.image[0].path,
    "babymart/products",
  );
  const galleryImages: string[] = [];
  if (files.images?.length) {
    for (const file of files.images) {
      const uploaded = await uploadToCloudinary(file.path, "babymart/products");
      galleryImages.push(uploaded.url);
    }
  }
  const product = await createProductService(vendorId, {
    ...req.body,
    image: mainImage.url,
    images: galleryImages,
  });
  apiResponse(
    req.res!,
    StatusCodes.CREATED,
    "Product created successfully.",
    product,
  );
};

export const getAllProductsController = async (
  req: AuthRequest,
): Promise<void> => {
  const vendorId = req.user!.id;
  const products = await getAllProductsService(vendorId, {
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    search: req.query.search ? String(req.query.search) : "",
    isActive:
      req.query.isActive !== undefined
        ? req.query.isActive === "true"
        : undefined,
    isApproved:
      req.query.isApproved !== undefined
        ? req.query.isApproved === "true"
        : undefined,
    sortBy: (req.query.sortBy as string) || "createdAt",
    sortOrder: req.query.sortOrder === "asc" ? "asc" : "desc",
  });
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Products fetched successfully.",
    products,
  );
};

export const getProductByIdController = async (
  req: AuthRequest,
): Promise<void> => {
  const vendorId = req.user!.id;
  const product = await getProductByIdService(vendorId, req.params.productId);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Product fetched successfully.",
    product,
  );
};

export const editProductController = async (
  req: AuthRequest,
): Promise<void> => {
  const vendorId = req.user!.id;
  const files = req.files as {
    image?: Express.Multer.File[];
    images?: Express.Multer.File[];
  };
  const payload: Record<string, any> = {
    ...req.body,
  };
  if (files?.image?.length) {
    const uploaded = await uploadToCloudinary(
      files.image[0].path,
      "babymart/products",
    );
    payload.image = uploaded.url;
  }
  if (files?.images?.length) {
    const galleryImages: string[] = [];
    for (const file of files.images) {
      const uploaded = await uploadToCloudinary(file.path, "babymart/products");
      galleryImages.push(uploaded.url);
    }
    payload.images = galleryImages;
  }
  const product = await editProductService(
    vendorId,
    req.params.productId,
    payload,
  );
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Product updated successfully.",
    product,
  );
};

export const deleteProductController = async (
  req: AuthRequest,
): Promise<void> => {
  const vendorId = req.user!.id;
  await deleteProductService(vendorId, req.params.productId);
  apiResponse(req.res!, StatusCodes.OK, "Product deleted successfully.");
};
