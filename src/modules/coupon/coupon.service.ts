import Coupon from "../../models/coupon.model";
import { BadRequestError, NotFoundError } from "../../utils/errors/app.error";
import {
  CreateCouponInput,
  UpdateCouponInput,
} from "../../validators/coupon.validation";

/* =========================
   Helper Functions
========================= */
const validateCouponCode = async (code: string, couponId?: string) => {
  const exists = await Coupon.findOne({
    ...(couponId && { _id: { $ne: couponId } }),
    code: code.toUpperCase(),
  });
  if (exists) {
    throw new BadRequestError("Coupon code already exists.");
  }
};

/* =========================
   Coupon Services
========================= */

export const createCouponService = async (payload: CreateCouponInput) => {
  await validateCouponCode(payload.code);
  return await Coupon.create(payload);
};

export const getAllCouponsService = async (
  page = 1,
  limit = 10,
  search = "",
) => {
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = {};
  if (search) {
    filter.code = {
      $regex: search,
      $options: "i",
    };
  }
  const [coupons, total] = await Promise.all([
    Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Coupon.countDocuments(filter),
  ]);

  return {
    coupons,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};
export const getCouponByIdService = async (couponId: string) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    throw new NotFoundError("Coupon not found.");
  }
  return coupon;
};

export const getCouponByCodeService = async (code: string) => {
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });
  if (!coupon) {
    throw new NotFoundError("Coupon not found.");
  }
  return coupon;
};

export const updateCouponService = async (
  couponId: string,
  payload: UpdateCouponInput,
) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    throw new NotFoundError("Coupon not found.");
  }
  if (payload.code) {
    await validateCouponCode(payload.code, couponId);
  }
  Object.assign(coupon, payload);
  await coupon.save();
  return coupon;
};

export const deleteCouponService = async (couponId: string) => {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    throw new NotFoundError("Coupon not found.");
  }
  await coupon.deleteOne();
  return coupon;
};
