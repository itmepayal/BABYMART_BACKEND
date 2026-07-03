import Brand from "../../models/brand.model";
import Product from "../../models/product.model";
import { BadRequestError, NotFoundError } from "../../utils/errors/app.error";
import {
  BrandInput,
  UpdateBrandInput,
} from "../../validators/brand.validation";

/* =========================
   Brand Services
========================= */
export const createBrandService = async (payload: BrandInput) => {
  const exists = await Brand.findOne({
    title: {
      $regex: new RegExp(`^${payload.title}$`, "i"),
    },
  });
  if (exists) {
    throw new BadRequestError("Brand already exists.");
  }
  return await Brand.create(payload);
};

export const getAllBrandsService = async (
  page = 1,
  limit = 10,
  search = "",
) => {
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = {};
  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }
  const [brands, total] = await Promise.all([
    Brand.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Brand.countDocuments(filter),
  ]);
  return {
    brands,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getBrandByIdService = async (brandId: string) => {
  const brand = await Brand.findById(brandId);
  if (!brand) {
    throw new NotFoundError("Brand not found.");
  }
  return brand;
};

export const updateBrandService = async (
  brandId: string,
  payload: UpdateBrandInput,
) => {
  const brand = await Brand.findById(brandId);
  if (!brand) {
    throw new NotFoundError("Brand not found.");
  }
  if (payload.title) {
    const exists = await Brand.findOne({
      _id: { $ne: brandId },
      title: {
        $regex: new RegExp(`^${payload.title}$`, "i"),
      },
    });
    if (exists) {
      throw new BadRequestError("Brand already exists.");
    }
  }
  Object.assign(brand, payload);
  await brand.save();
  return brand;
};

export const deleteBrandService = async (brandId: string) => {
  const brand = await Brand.findById(brandId);
  if (!brand) {
    throw new NotFoundError("Brand not found.");
  }
  const isUsed = await Product.exists({
    brand: brand._id,
  });
  if (isUsed) {
    throw new BadRequestError(
      "Cannot delete brand because it is assigned to one or more products.",
    );
  }
  await brand.deleteOne();
};
