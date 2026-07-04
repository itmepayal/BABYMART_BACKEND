import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../../types/express";
import { apiResponse } from "../../utils/response/app.response";
import {
  getAllProductsService,
  getProductBySlugService,
  getRelatedProductsService,
} from "./product.service";

/* =========================
  Product Controllers
========================= */
export const getAllProductsController = async (
  req: AuthRequest,
): Promise<void> => {
  const products = await getAllProductsService({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: String(req.query.search || ""),
    category: req.query.category as string | undefined,
    collection: req.query.collection as string | undefined,
    vendor: req.query.vendor as string | undefined,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    tags: req.query.tags
      ? String(req.query.tags)
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
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

export const getRelatedProductsController = async (
  req: AuthRequest,
): Promise<void> => {
  const relatedProducts = await getRelatedProductsService(
    req.params.productId,
    req.query.limit ? Number(req.query.limit) : 8,
  );

  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Related products fetched successfully.",
    relatedProducts,
  );
};
