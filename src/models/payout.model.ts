import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IPayout extends Document {
  payoutNumber: string;

  vendor: Types.ObjectId;
  orders: Types.ObjectId[];

  grossAmount: number;
  commissionAmount: number;
  netAmount: number;

  method: "bank_transfer" | "upi" | "manual";
  transactionRef?: string;

  status: "pending" | "processing" | "paid" | "failed" | "cancelled";
  failureReason?: string;

  periodStart: Date;
  periodEnd: Date;

  paidAt?: Date;

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

interface IPayoutModel extends Model<IPayout> {}

const payoutSchema = new Schema<IPayout, IPayoutModel>(
  {
    payoutNumber: {
      type: String,
      unique: true,
    },

    vendor: {
      type: Schema.Types.ObjectId,
      ref: "VendorProfile",
      required: true,
    },

    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    grossAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    commissionAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    netAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    method: {
      type: String,
      enum: ["bank_transfer", "upi", "manual"],
      default: "bank_transfer",
    },

    transactionRef: String,

    status: {
      type: String,
      enum: ["pending", "processing", "paid", "failed", "cancelled"],
      default: "pending",
    },

    failureReason: String,

    periodStart: {
      type: Date,
      required: true,
    },

    periodEnd: {
      type: Date,
      required: true,
    },

    paidAt: Date,

    notes: String,
  },
  {
    timestamps: true,
  },
);

payoutSchema.pre("save", function (next) {
  if (!this.payoutNumber) {
    this.payoutNumber =
      "PO" +
      Date.now().toString().slice(-8) +
      Math.floor(Math.random() * 900 + 100);
  }
});

payoutSchema.index({ vendor: 1, status: 1 });
payoutSchema.index({ payoutNumber: 1 });

const Payout = mongoose.model<IPayout, IPayoutModel>("Payout", payoutSchema);

export default Payout;
