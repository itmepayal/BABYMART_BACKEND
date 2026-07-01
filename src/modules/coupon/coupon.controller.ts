import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../../types/express";
import { apiResponse } from "../../utils/response/app.response";
import {
  createCouponService,
  deleteCouponService,
  getAllCouponsService,
  getCouponByCodeService,
  getCouponByIdService,
  updateCouponService,
} from "./coupon.service";

/* =========================
   Coupon Controllers
========================= */
export const createCouponController = async (
  req: AuthRequest,
): Promise<void> => {
  const coupon = await createCouponService(req.body);
  apiResponse(
    req.res!,
    StatusCodes.CREATED,
    "Coupon created successfully.",
    coupon,
  );
};

export const getAllCouponsController = async (
  req: AuthRequest,
): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = String(req.query.search || "");
  const coupons = await getAllCouponsService(page, limit, search);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Coupons fetched successfully.",
    coupons,
  );
};

export const getCouponByIdController = async (
  req: AuthRequest,
): Promise<void> => {
  const coupon = await getCouponByIdService(req.params.couponId);
  apiResponse(req.res!, StatusCodes.OK, "Coupon fetched successfully.", coupon);
};

export const getCouponByCodeController = async (
  req: AuthRequest,
): Promise<void> => {
  const coupon = await getCouponByCodeService(req.params.code);
  apiResponse(req.res!, StatusCodes.OK, "Coupon fetched successfully.", coupon);
};

export const updateCouponController = async (
  req: AuthRequest,
): Promise<void> => {
  const coupon = await updateCouponService(req.params.couponId, req.body);

  apiResponse(req.res!, StatusCodes.OK, "Coupon updated successfully.", coupon);
};

export const deleteCouponController = async (
  req: AuthRequest,
): Promise<void> => {
  await deleteCouponService(req.params.couponId);
  apiResponse(req.res!, StatusCodes.OK, "Coupon deleted successfully.");
};
