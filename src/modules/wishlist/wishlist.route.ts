import { Router } from "express";
import {
  addToWishlistController,
  clearWishlistController,
  getWishlistController,
  removeFromWishlistController,
} from "./wishlist.controller";
import { protect } from "../../middlewares/auth.middleware";

export const wishlistRouter = Router();

/* =========================
   Wishlist Management
========================= */
wishlistRouter.get("/", protect, getWishlistController);
wishlistRouter.post("/", protect, addToWishlistController);
wishlistRouter.delete("/:productId", protect, removeFromWishlistController);
wishlistRouter.delete("/clear", protect, clearWishlistController);
