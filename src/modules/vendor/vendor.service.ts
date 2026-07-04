import Product from "../../models/product.model";
import Category from "../../models/category.model";
import Collection from "../../models/collection.model";
import { BadRequestError, NotFoundError } from "../../utils/errors/app.error";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../../validators/product.validation";
import VendorProfile from "../../models/vendor.model";
import {
  normalizeProductCode,
  PRODUCT_SORT_FIELDS,
  sanitizePagination,
  stripProtectedFields,
} from "../../utils/secure/product.utils";

/* =========================
   Product Validation
========================= */
export const validateCategories = async (categoryIds: string[]) => {
  const count = await Category.countDocuments({
    _id: { $in: categoryIds },
  });

  if (count !== categoryIds.length) {
    throw new BadRequestError("One or more categories are invalid.");
  }
};

export const validateCollections = async (collectionIds: string[]) => {
  const count = await Collection.countDocuments({
    _id: { $in: collectionIds },
  });

  if (count !== collectionIds.length) {
    throw new BadRequestError("One or more collections are invalid.");
  }
};

export const validateProductCode = async (code: string, productId?: string) => {
  const exists = await Product.findOne({
    ...(productId && { _id: { $ne: productId } }),
    code,
  });

  if (exists) {
    throw new BadRequestError("Product code already exists.");
  }
};

export const validateVendorExists = async (vendorId: string) => {
  const vendor = await VendorProfile.findById(vendorId);
  if (!vendor) {
    throw new NotFoundError("Vendor not found.");
  }
};

/* =========================
   Product Service
========================= */
export const createProductService = async (
  vendorId: string,
  payload: CreateProductInput,
) => {
  await validateVendorExists(vendorId);

  const sanitizedPayload = normalizeProductCode(stripProtectedFields(payload));

  if (sanitizedPayload.categories?.length) {
    await validateCategories(sanitizedPayload.categories);
  }

  if (sanitizedPayload.collections?.length) {
    await validateCollections(sanitizedPayload.collections);
  }

  if (sanitizedPayload.code) {
    await validateProductCode(sanitizedPayload.code);
  }

  return await Product.create({
    ...sanitizedPayload,
    vendor: vendorId,
    isApproved: false,
    approvedBy: undefined,
    approvedAt: undefined,
    rejectionReason: undefined,
  });
};

export const getAllProductsService = async (
  vendorId: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    isApproved?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    isActive,
    isApproved,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const {
    page: safePage,
    limit: safeLimit,
    skip,
  } = sanitizePagination(page, limit);

  const safeSortBy = PRODUCT_SORT_FIELDS.includes(
    sortBy as (typeof PRODUCT_SORT_FIELDS)[number],
  )
    ? sortBy
    : "createdAt";

  const filter: Record<string, unknown> = {
    vendor: vendorId,
  };

  if (search) {
    filter.$text = { $search: search };
  }

  if (isActive !== undefined) {
    filter.isActive = isActive;
  }

  if (isApproved !== undefined) {
    filter.isApproved = isApproved;
  }

  const sort: Record<string, 1 | -1> = {
    [safeSortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("categories")
      .populate("collections")
      .sort(sort)
      .skip(skip)
      .limit(safeLimit),

    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

export const getProductByIdService = async (
  vendorId: string,
  productId: string,
) => {
  const product = await Product.findOne({ _id: productId, vendor: vendorId })
    .populate("categories")
    .populate("collections");

  if (!product) {
    throw new NotFoundError("Product not found.");
  }

  return product;
};

export const editProductService = async (
  vendorId: string,
  productId: string,
  payload: UpdateProductInput,
) => {
  const product = await Product.findOne({
    _id: productId,
    vendor: vendorId,
  });

  if (!product) {
    throw new NotFoundError("Product not found.");
  }

  const sanitizedPayload = normalizeProductCode(stripProtectedFields(payload));

  if (sanitizedPayload.categories) {
    await validateCategories(sanitizedPayload.categories);
  }

  if (sanitizedPayload.collections) {
    await validateCollections(sanitizedPayload.collections);
  }

  if (sanitizedPayload.code) {
    await validateProductCode(sanitizedPayload.code, productId);
  }

  Object.assign(product, sanitizedPayload);

  await product.save();

  return await product.populate([
    { path: "categories" },
    { path: "collections" },
  ]);
};

export const deleteProductService = async (
  vendorId: string,
  productId: string,
) => {
  const product = await Product.findOneAndDelete({
    _id: productId,
    vendor: vendorId,
  });

  if (!product) {
    throw new NotFoundError("Product not found.");
  }

  return product;
};
