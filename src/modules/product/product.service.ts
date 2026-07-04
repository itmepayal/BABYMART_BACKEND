import Product from "../../models/product.model";
import { NotFoundError } from "../../utils/errors/app.error";

/* =========================
   Product Services
========================= */
export const getAllProductsService = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  collection?: string;
  vendor?: string;
  minPrice?: number;
  maxPrice?: number;
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
    tags,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {
    isActive: true,
    isApproved: true,
  };

  if (search) {
    filter.$text = {
      $search: search,
    };
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
    filter.tags = {
      $in: tags,
    };
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

export const getProductBySlugService = async (slug: string) => {
  const product = await Product.findOne({
    slug,
    isActive: true,
    isApproved: true,
  })
    .populate("categories")
    .populate("collections")
    .populate("vendor", "-password");

  if (!product) {
    throw new NotFoundError("Product not found.");
  }

  return product;
};

export const getRelatedProductsService = async (
  productId: string,
  limit = 8,
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found.");
  }
  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    isActive: true,
    isApproved: true,
    $or: [
      {
        categories: {
          $in: product.categories,
        },
      },
      {
        collections: {
          $in: product.collections,
        },
      },
      {
        tags: {
          $in: product.tags,
        },
      },
    ],
  })
    .sort({
      sold: -1,
      rating: -1,
    })
    .limit(limit);
  return relatedProducts;
};
