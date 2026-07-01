import Cart from "../../models/cart.model";
import Coupon from "../../models/coupon.model";
import Product from "../../models/product.model";
import { BadRequestError, NotFoundError } from "../../utils/errors/app.error";

/* =========================
   Helper
========================= */
const getOrCreateCart = async (userId: string) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }
  return cart;
};

/* =========================
   Cart Services
========================= */
export const getCartService = async (userId: string) => {
  return await getOrCreateCart(userId);
};

export const addToCartService = async (
  userId: string,
  productId: string,
  qty = 1,
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found.");
  }
  const cart = await getOrCreateCart(userId);
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );
  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.items.push({
      product: product._id,
      title: product.title,
      image: product.image,
      price: product.price,
      qty,
    });
  }
  await cart.save();
  return cart;
};

export const updateCartItemService = async (
  userId: string,
  productId: string,
  qty: number,
) => {
  if (qty < 1) {
    throw new BadRequestError("Quantity must be at least 1.");
  }
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) {
    throw new NotFoundError("Cart item not found.");
  }
  item.qty = qty;
  await cart.save();
  return cart;
};

export const removeCartItemService = async (
  userId: string,
  productId: string,
) => {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );
  await cart.save();
  return cart;
};

export const clearCartService = async (userId: string) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  cart.couponCode = null;
  cart.discountAmount = 0;
  await cart.save();
  return cart;
};

export const applyCouponService = async (
  userId: string,
  couponCode: string,
) => {
  const cart = await getOrCreateCart(userId);
  if (cart.couponCode) {
    throw new BadRequestError(
      "A coupon has already been applied to this cart.",
    );
  }
  const coupon = await Coupon.findOne({
    code: couponCode.toUpperCase(),
  });
  if (!coupon) {
    throw new NotFoundError("Coupon not found.");
  }
  if (!coupon.isValid(cart.subtotal)) {
    throw new BadRequestError("Coupon is not valid.");
  }
  cart.couponCode = coupon.code;
  cart.discountAmount = coupon.calculateDiscount(cart.subtotal);
  await cart.save();
  return cart;
};
export const removeCouponService = async (userId: string) => {
  const cart = await getOrCreateCart(userId);
  cart.couponCode = null;
  cart.discountAmount = 0;
  await cart.save();
  return cart;
};
