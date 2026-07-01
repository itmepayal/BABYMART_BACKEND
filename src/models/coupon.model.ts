import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountType: "percent" | "flat";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  expiresAt?: Date;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  isValid(orderAmount?: number): boolean;
  calculateDiscount(orderAmount: number): number;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percent", "flat"],
      default: "percent",
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number,
    },
    expiresAt: {
      type: Date,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

couponSchema.methods.isValid = function (
  this: ICoupon,
  orderAmount: number = 0,
): boolean {
  if (!this.isActive) return false;
  if (this.expiresAt && this.expiresAt < new Date()) return false;
  if (this.usageLimit !== null && this.usedCount >= this.usageLimit)
    return false;
  if (orderAmount < this.minOrderAmount) return false;

  return true;
};

couponSchema.methods.calculateDiscount = function (
  this: ICoupon,
  orderAmount: number,
): number {
  let discount =
    this.discountType === "percent"
      ? (orderAmount * this.discountValue) / 100
      : this.discountValue;

  if (this.maxDiscountAmount) {
    discount = Math.min(discount, this.maxDiscountAmount);
  }

  return Math.min(discount, orderAmount);
};

const Coupon: Model<ICoupon> = mongoose.model<ICoupon>("Coupon", couponSchema);

export default Coupon;
