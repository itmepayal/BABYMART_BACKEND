import Collection from "../../models/collection.model";
import Category from "../../models/category.model";
import { BadRequestError, NotFoundError } from "../../utils/errors/app.error";
import {
  CreateCollectionInput,
  UpdateCollectionInput,
} from "../../validators/collection.validation";
import Product from "../../models/product.model";

/* =========================
   Collection Services
========================= */

export const createCollectionService = async (
  payload: CreateCollectionInput,
) => {
  const exists = await Collection.findOne({
    label: {
      $regex: new RegExp(`^${payload.label}$`, "i"),
    },
  });

  if (exists) {
    throw new BadRequestError("Collection already exists.");
  }

  const categoryCount = await Category.countDocuments({
    _id: { $in: payload.categories },
  });

  if (categoryCount !== payload.categories.length) {
    throw new BadRequestError("One or more categories are invalid.");
  }

  return await Collection.create(payload);
};

export const getAllCollectionsService = async (
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

  const [collections, total] = await Promise.all([
    Collection.find(filter)
      .populate("categories")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Collection.countDocuments(filter),
  ]);

  return {
    collections,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCollectionByIdService = async (collectionId: string) => {
  const collection =
    await Collection.findById(collectionId).populate("categories");

  if (!collection) {
    throw new NotFoundError("Collection not found.");
  }

  return collection;
};

export const updateCollectionService = async (
  collectionId: string,
  payload: UpdateCollectionInput,
) => {
  const collection = await Collection.findById(collectionId);

  if (!collection) {
    throw new NotFoundError("Collection not found.");
  }

  if (payload.label) {
    const exists = await Collection.findOne({
      _id: { $ne: collectionId },
      label: {
        $regex: new RegExp(`^${payload.label}$`, "i"),
      },
    });

    if (exists) {
      throw new BadRequestError("Collection already exists.");
    }
  }

  if (payload.categories) {
    const categoryCount = await Category.countDocuments({
      _id: { $in: payload.categories },
    });

    if (categoryCount !== payload.categories.length) {
      throw new BadRequestError("One or more categories are invalid.");
    }
  }
  Object.assign(collection, payload);
  await collection.save();
  return await collection.populate("categories");
};

export const deleteCollectionService = async (collectionId: string) => {
  const collection = await Collection.findById(collectionId);

  if (!collection) {
    throw new NotFoundError("Collection not found.");
  }

  const isUsed = await Product.exists({
    collections: collection._id,
  });

  if (isUsed) {
    throw new BadRequestError(
      "Cannot delete collection because it is assigned to one or more products.",
    );
  }

  await collection.deleteOne();
};
