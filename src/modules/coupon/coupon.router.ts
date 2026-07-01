import { Router } from "express";
import {
  createCouponController,
  deleteCouponController,
  getAllCouponsController,
  getCouponByCodeController,
  getCouponByIdController,
  updateCouponController,
} from "./coupon.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";
import { validateRequestBody } from "../../validators";
import {
  createCouponSchema,
  updateCouponSchema,
} from "../../validators/coupon.validation";

export const couponRouter = Router();

/* =========================
   Coupon Management
========================= */
couponRouter.get("/", getAllCouponsController);
couponRouter.get("/code/:code", getCouponByCodeController);
couponRouter.get("/:couponId", getCouponByIdController);
couponRouter.post(
  "/",
  protect,
  authorize("admin"),
  validateRequestBody(createCouponSchema),
  createCouponController,
);
couponRouter.patch(
  "/:couponId",
  protect,
  authorize("admin"),
  validateRequestBody(updateCouponSchema),
  updateCouponController,
);
couponRouter.delete(
  "/:couponId",
  protect,
  authorize("admin"),
  deleteCouponController,
);

export default couponRouter;
