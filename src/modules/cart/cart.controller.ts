import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../../types/express";
import { apiResponse } from "../../utils/response/app.response";
import {
  addToCartService,
  applyCouponService,
  clearCartService,
  getCartService,
  removeCartItemService,
  removeCouponService,
  updateCartItemService,
} from "./cart.service";

/* =========================
   Cart Controllers
========================= */

export const getCartController = async (req: AuthRequest): Promise<void> => {
  const userId = req?.user?.id as string;
  const cart = await getCartService(userId);
  apiResponse(req.res!, StatusCodes.OK, "Cart fetched successfully.", cart);
};

export const addToCartController = async (req: AuthRequest): Promise<void> => {
  const userId = req?.user?.id as string;
  const { productId, qty } = req.body;
  const cart = await addToCartService(userId, productId, Number(qty) || 1);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Product added to cart successfully.",
    cart,
  );
};

export const updateCartItemController = async (
  req: AuthRequest,
): Promise<void> => {
  const userId = req?.user?.id as string;
  const { productId, qty } = req.body;
  const cart = await updateCartItemService(userId, productId, Number(qty));
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Cart item updated successfully.",
    cart,
  );
};

export const removeCartItemController = async (
  req: AuthRequest,
): Promise<void> => {
  const userId = req?.user?.id as string;
  const cart = await removeCartItemService(userId, req.params.productId);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Cart item removed successfully.",
    cart,
  );
};

export const clearCartController = async (req: AuthRequest): Promise<void> => {
  const userId = req?.user?.id as string;
  const cart = await clearCartService(userId);
  apiResponse(req.res!, StatusCodes.OK, "Cart cleared successfully.", cart);
};

export const applyCouponController = async (
  req: AuthRequest,
): Promise<void> => {
  const userId = req?.user?.id as string;
  const { couponCode } = req.body;
  const cart = await applyCouponService(userId, couponCode);
  apiResponse(req.res!, StatusCodes.OK, "Coupon applied successfully.", cart);
};

export const removeCouponController = async (
  req: AuthRequest,
): Promise<void> => {
  const userId = req?.user?.id as string;
  const cart = await removeCouponService(userId);
  apiResponse(req.res!, StatusCodes.OK, "Coupon removed successfully.", cart);
};
