import mongoose, { Document, Model, Schema, Types } from "mongoose";
import slugify from "slugify";

export interface IBankDetails {
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  upiId?: string;
}

export interface IVendorProfile extends Document {
  user: Types.ObjectId;

  storeName: string;
  storeSlug: string;
  storeLogo?: string;
  storeBanner?: string;
  storeDescription?: string;

  commissionRate: number; // percent, e.g. 10 = 10%

  gstNumber?: string;
  panNumber?: string;
  bankDetails?: IBankDetails;

  isApproved: boolean;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;

  isActive: boolean;

  totalSales: number;
  totalOrders: number;
  walletBalance: number; // pending payout amount

  createdAt: Date;
  updatedAt: Date;
}

interface IVendorProfileModel extends Model<IVendorProfile> {}

const bankDetailsSchema = new Schema<IBankDetails>(
  {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    upiId: String,
  },
  {
    _id: false,
  },
);

const vendorProfileSchema = new Schema<IVendorProfile, IVendorProfileModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    storeName: {
      type: String,
      required: [true, "Store name is required"],
      trim: true,
    },

    storeSlug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    storeLogo: String,
    storeBanner: String,
    storeDescription: {
      type: String,
      default: "",
    },

    commissionRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },

    gstNumber: String,
    panNumber: String,
    bankDetails: bankDetailsSchema,

    isApproved: {
      type: Boolean,
      default: false,
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: Date,

    rejectionReason: String,

    isActive: {
      type: Boolean,
      default: true,
    },

    totalSales: {
      type: Number,
      default: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    walletBalance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

vendorProfileSchema.pre("validate", function (next) {
  if (!this.storeSlug && this.storeName) {
    this.storeSlug =
      slugify(this.storeName, {
        lower: true,
        strict: true,
      }) +
      "-" +
      Date.now().toString(36).slice(-4);
  }
});

vendorProfileSchema.index({ storeSlug: 1 });
vendorProfileSchema.index({ user: 1 });
vendorProfileSchema.index({ isApproved: 1, isActive: 1 });

const VendorProfile = mongoose.model<IVendorProfile, IVendorProfileModel>(
  "VendorProfile",
  vendorProfileSchema,
);

export default VendorProfile;
