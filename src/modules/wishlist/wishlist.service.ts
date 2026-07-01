import Wishlist from "../../models/wishlist.model";
import Product from "../../models/product.model";
import { BadRequestError, NotFoundError } from "../../utils/errors/app.error";

/* =========================
   Helper
========================= */
const getOrCreateWishlist = async (userId: string) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate(
    "items.product",
  );
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      items: [],
    });
    wishlist = await wishlist.populate("items.product");
  }
  return wishlist;
};

/* =========================
   Wishlist Services
========================= */

export const getWishlistService = async (userId: string) => {
  return await getOrCreateWishlist(userId);
};

export const addToWishlistService = async (
  userId: string,
  productId: string,
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found.");
  }
  const wishlist = await getOrCreateWishlist(userId);
  const exists = wishlist.items.some(
    (item) => item.product._id.toString() === productId,
  );
  if (exists) {
    throw new BadRequestError("Product already exists in wishlist.");
  }
  wishlist.items.push({
    product: product._id,
    addedAt: new Date(),
  });
  await wishlist.save();
  return await wishlist.populate("items.product");
};

export const removeFromWishlistService = async (
  userId: string,
  productId: string,
) => {
  const wishlist = await getOrCreateWishlist(userId);
  const exists = wishlist.items.some(
    (item) => item.product._id.toString() === productId,
  );
  if (!exists) {
    throw new NotFoundError("Product not found in wishlist.");
  }
  wishlist.items = wishlist.items.filter(
    (item) => item.product._id.toString() !== productId,
  );
  await wishlist.save();
  return await wishlist.populate("items.product");
};

export const clearWishlistService = async (userId: string) => {
  const wishlist = await getOrCreateWishlist(userId);
  wishlist.items = [];
  await wishlist.save();
  return wishlist;
};
