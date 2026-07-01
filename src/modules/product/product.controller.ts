import { StatusCodes } from "http-status-codes";
import { uploadToCloudinary } from "../../config/cloudinary.config";
import { AuthRequest } from "../../types/express";
import { BadRequestError } from "../../utils/errors/app.error";
import { apiResponse } from "../../utils/response/app.response";
import {
  createProductService,
  deleteProductService,
  getAllProductsService,
  getProductByIdService,
  getProductBySlugService,
  updateProductService,
} from "./product.service";

/* =========================
   Product Controllers
========================= */
export const createProductController = async (
  req: AuthRequest,
): Promise<void> => {
  const files = req.files as {
    image?: Express.Multer.File[];
    images?: Express.Multer.File[];
  };

  if (!files?.image?.length) {
    throw new BadRequestError("Product image is required.");
  }

  const mainImageUpload = await uploadToCloudinary(
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

  const product = await createProductService({
    ...req.body,
    image: mainImageUpload.url,
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
  const products = await getAllProductsService({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: String(req.query.search || ""),
    category: req.query.category as string,
    collection: req.query.collection as string,
    vendor: req.query.vendor as string,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    inStock:
      req.query.inStock !== undefined
        ? req.query.inStock === "true"
        : undefined,
    isFeatured:
      req.query.isFeatured !== undefined
        ? req.query.isFeatured === "true"
        : undefined,
    isActive:
      req.query.isActive !== undefined
        ? req.query.isActive === "true"
        : undefined,
    tags: req.query.tags ? String(req.query.tags).split(",") : undefined,
    sortBy: req.query.sortBy as string,
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
  const product = await getProductByIdService(req.params.productId);

  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Product fetched successfully.",
    product,
  );
};

export const getProductBySlugController = async (
  req: AuthRequest,
): Promise<void> => {
  const product = await getProductBySlugService(req.params.slug);

  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Product fetched successfully.",
    product,
  );
};

export const updateProductController = async (
  req: AuthRequest,
): Promise<void> => {
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

  const product = await updateProductService(req.params.productId, payload);

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
  await deleteProductService(req.params.productId);
  apiResponse(req.res!, StatusCodes.OK, "Product deleted successfully.");
};
