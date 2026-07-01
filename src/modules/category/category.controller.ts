import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../../types/express";
import {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from "./category.service";
import { apiResponse } from "../../utils/response/app.response";

/* =========================
   Category Controllers
========================= */
export const createCategoryController = async (
  req: AuthRequest,
): Promise<void> => {
  const category = await createCategoryService(req.body);
  apiResponse(
    req.res!,
    StatusCodes.CREATED,
    "Category created successfully.",
    category,
  );
};

export const getAllCategoriesController = async (
  req: AuthRequest,
): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = String(req.query.search || "");
  const categories = await getAllCategoriesService(page, limit, search);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Categories fetched successfully.",
    categories,
  );
};

export const getCategoryByIdController = async (
  req: AuthRequest,
): Promise<void> => {
  const category = await getCategoryByIdService(req.params.categoryId);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Category fetched successfully.",
    category,
  );
};

export const updateCategoryController = async (
  req: AuthRequest,
): Promise<void> => {
  const category = await updateCategoryService(req.params.categoryId, req.body);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Category updated successfully.",
    category,
  );
};

export const deleteCategoryController = async (
  req: AuthRequest,
): Promise<void> => {
  await deleteCategoryService(req.params.categoryId);
  apiResponse(req.res!, StatusCodes.OK, "Category deleted successfully.");
};
