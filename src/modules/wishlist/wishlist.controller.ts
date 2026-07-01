import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../../types/express";
import { apiResponse } from "../../utils/response/app.response";
import {
  addToWishlistService,
  clearWishlistService,
  getWishlistService,
  removeFromWishlistService,
} from "./wishlist.service";

/* =========================
   Wishlist Controllers
========================= */
export const getWishlistController = async (
  req: AuthRequest,
): Promise<void> => {
  const userId = req?.user?.id as string;
  const wishlist = await getWishlistService(userId);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Wishlist fetched successfully.",
    wishlist,
  );
};

export const addToWishlistController = async (
  req: AuthRequest,
): Promise<void> => {
  const userId = req?.user?.id as string;
  const { productId } = req.body;
  const wishlist = await addToWishlistService(userId, productId);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Product added to wishlist successfully.",
    wishlist,
  );
};

export const removeFromWishlistController = async (
  req: AuthRequest,
): Promise<void> => {
  const userId = req?.user?.id as string;
  const wishlist = await removeFromWishlistService(
    userId,
    req.params.productId,
  );
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Product removed from wishlist successfully.",
    wishlist,
  );
};

export const clearWishlistController = async (
  req: AuthRequest,
): Promise<void> => {
  const userId = req?.user?.id as string;
  const wishlist = await clearWishlistService(userId);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Wishlist cleared successfully.",
    wishlist,
  );
};
