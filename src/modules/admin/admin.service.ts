import mongoose, { Types } from "mongoose";
import User from "../../models/user.model";
import { BadRequestError, NotFoundError } from "../../utils/errors/app.error";
import Cart from "../../models/cart.model";
import Wishlist from "../../models/wishlist.model";
import Review from "../../models/review.model";
import Category from "../../models/category.model";
import Collection from "../../models/collection.model";
import Product from "../../models/product.model";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../../validators/product.validation";

/* =========================
   Admin User Management Services
========================= */
export const getAllUsersService = async (page = 1, limit = 10, search = "") => {
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -refreshToken")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);
  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUserByIdService = async (userId: string) => {
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  return user;
};

export const editUserRoleService = async (
  userId: string,
  role: "customer" | "vendor" | "admin",
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  user.role = role;
  await user.save();
  return user;
};

export const editUserStatusService = async (
  userId: string,
  isActive: boolean,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  user.isActive = isActive;
  if (!isActive) {
    user.refreshToken = "";
  }
  await user.save();
  return user;
};

export const deleteUserService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Cart.deleteOne({ user: user._id }).session(session);
    await Wishlist.deleteOne({ user: user._id }).session(session);
    await Review.deleteMany({ user: user._id }).session(session);
    await user.deleteOne({ session });
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
  return null;
};

/* =========================
   Admin Product Management Services
========================= */
const validateCategories = async (categoryIds: string[]) => {
  const count = await Category.countDocuments({
    _id: { $in: categoryIds },
  });
  if (count !== categoryIds.length) {
    throw new BadRequestError("One or more categories are invalid.");
  }
};

const validateCollections = async (collectionIds: string[]) => {
  const count = await Collection.countDocuments({
    _id: { $in: collectionIds },
  });
  if (count !== collectionIds.length) {
    throw new BadRequestError("One or more collections are invalid.");
  }
};

const validateProductCode = async (code: string, productId?: string) => {
  const exists = await Product.findOne({
    ...(productId && { _id: { $ne: productId } }),
    code,
  });
  if (exists) {
    throw new BadRequestError("Product code already exists.");
  }
};

export const createProductService = async (payload: CreateProductInput) => {
  if (payload.categories?.length) {
    await validateCategories(payload.categories);
  }
  if (payload.collections?.length) {
    await validateCollections(payload.collections);
  }

  if (payload.code) {
    await validateProductCode(payload.code);
  }

  return await Product.create(payload);
};

export const getAllProductsService = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  collection?: string;
  vendor?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  tags?: string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    category,
    collection,
    vendor,
    minPrice,
    maxPrice,
    inStock,
    isFeatured,
    isActive,
    tags,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$text = { $search: search };
  }
  if (category) {
    filter.categories = category;
  }
  if (collection) {
    filter.collections = collection;
  }
  if (vendor) {
    filter.vendor = vendor;
  }
  if (tags?.length) {
    filter.tags = { $in: tags };
  }
  if (typeof inStock === "boolean") {
    filter.inStock = inStock;
  }
  if (typeof isFeatured === "boolean") {
    filter.isFeatured = isFeatured;
  }
  if (typeof isActive === "boolean") {
    filter.isActive = isActive;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {
      ...(minPrice !== undefined && { $gte: minPrice }),
      ...(maxPrice !== undefined && { $lte: maxPrice }),
    };
  }
  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("categories")
      .populate("collections")
      .populate("vendor", "-password")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);
  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductByIdService = async (productId: string) => {
  const product = await Product.findById(productId)
    .populate("categories")
    .populate("collections")
    .populate("vendor", "-password");
  if (!product) {
    throw new NotFoundError("Product not found.");
  }

  return product;
};

export const getProductBySlugService = async (slug: string) => {
  const product = await Product.findOne({ slug })
    .populate("categories")
    .populate("collections")
    .populate("vendor", "-password");
  if (!product) {
    throw new NotFoundError("Product not found.");
  }
  return product;
};

export const editProductService = async (
  productId: string,
  payload: UpdateProductInput,
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found.");
  }
  if (payload.categories) {
    await validateCategories(payload.categories);
  }
  if (payload.collections) {
    await validateCollections(payload.collections);
  }
  if (payload.code) {
    await validateProductCode(payload.code, productId);
  }
  Object.assign(product, payload);
  await product.save();
  return await product.populate([
    { path: "categories" },
    { path: "collections" },
    { path: "vendor", select: "-password" },
  ]);
};

export const deleteProductService = async (productId: string) => {
  const product = await Product.findOneAndDelete({
    _id: productId,
  });
  if (!product) {
    throw new NotFoundError("Product not found.");
  }
  return product;
};

export const approveProductService = async (
  productId: string,
  adminId: string,
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found.");
  }
  product.isApproved = true;
  product.approvedBy = new Types.ObjectId(adminId);
  product.approvedAt = new Date();
  product.rejectionReason = undefined;
  await product.save();
  return product;
};

export const rejectProductService = async (
  productId: string,
  adminId: string,
  reason: string,
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found.");
  }
  product.isApproved = false;
  product.approvedBy = new Types.ObjectId(adminId);
  product.approvedAt = undefined;
  product.rejectionReason = reason;
  await product.save();
  return product;
};

export const toggleFeaturedService = async (productId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found.");
  }
  product.isFeatured = !product.isFeatured;
  await product.save();
  return product;
};

export const toggleActiveService = async (productId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found.");
  }
  product.isActive = !product.isActive;
  await product.save();
  return product;
};
