import Category from "../../models/category.model";
import Collection from "../../models/collection.model";
import Product from "../../models/product.model";
import { NotFoundError, BadRequestError } from "../../utils/errors/app.error";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../../validators/category.validation";

/* =========================
   Category Services
========================= */
export const createCategoryService = async (payload: CreateCategoryInput) => {
  const existingCategory = await Category.findOne({
    label: {
      $regex: new RegExp(`^${payload.label}$`, "i"),
    },
  });
  if (existingCategory) {
    throw new BadRequestError("Category already exists.");
  }
  const category = await Category.create(payload);
  return category;
};

export const getAllCategoriesService = async (
  page = 1,
  limit = 10,
  search = "",
) => {
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.label = {
      $regex: search,
      $options: "i",
    };
  }

  const [categories, total] = await Promise.all([
    Category.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Category.countDocuments(filter),
  ]);

  return {
    categories,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

export const getCategoryByIdService = async (categoryId: string) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new NotFoundError("Category not found.");
  }
  return category;
};

export const updateCategoryService = async (
  categoryId: string,
  payload: UpdateCategoryInput,
) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new NotFoundError("Category not found.");
  }
  if (payload.label) {
    const existingCategory = await Category.findOne({
      _id: { $ne: categoryId },
      label: {
        $regex: new RegExp(`^${payload.label}$`, "i"),
      },
    });
    if (existingCategory) {
      throw new BadRequestError("Category already exists.");
    }
    category.label = payload.label;
  }
  await category.save();
  return category;
};

export const deleteCategoryService = async (categoryId: string) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new NotFoundError("Category not found.");
  }

  const [usedInCollections, usedInProducts] = await Promise.all([
    Collection.exists({
      categories: category._id,
    }),
    Product.exists({
      categories: category._id,
    }),
  ]);

  if (usedInCollections) {
    throw new BadRequestError(
      "Cannot delete category because it is assigned to one or more collections.",
    );
  }

  if (usedInProducts) {
    throw new BadRequestError(
      "Cannot delete category because it is assigned to one or more products.",
    );
  }

  await category.deleteOne();
};
