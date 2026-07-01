import { Router } from "express";
import {
  addToCartController,
  applyCouponController,
  clearCartController,
  getCartController,
  removeCartItemController,
  removeCouponController,
  updateCartItemController,
} from "./cart.controller";
import { protect } from "../../middlewares/auth.middleware";

export const cartRouter = Router();

/* =========================
   Cart Management
========================= */
cartRouter.get("/", protect, getCartController);
cartRouter.post("/", protect, addToCartController);
cartRouter.patch("/", protect, updateCartItemController);
cartRouter.delete("/", protect, clearCartController);
cartRouter.delete("/items/:productId", protect, removeCartItemController);
cartRouter.post("/coupon", protect, applyCouponController);
cartRouter.delete("/coupon", protect, removeCouponController);

export default cartRouter;
