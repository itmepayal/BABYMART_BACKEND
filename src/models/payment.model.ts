import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IPayment extends Document {
  order: Types.ObjectId;
  user: Types.ObjectId;

  transactionId: string;

  provider: "stripe" | "cod";
  paymentMethod: "card" | "cash_on_delivery";

  amount: number;
  currency: string;

  status:
    | "pending"
    | "processing"
    | "paid"
    | "failed"
    | "cancelled"
    | "refunded";

  gatewayResponse?: Record<string, any>;

  paidAt?: Date;
  refundedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

interface IPaymentModel extends Model<IPayment> {}

const paymentSchema = new Schema<IPayment, IPaymentModel>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    transactionId: {
      type: String,
      unique: true,
    },

    provider: {
      type: String,
      enum: ["stripe", "cod"],
      default: "stripe",
    },

    paymentMethod: {
      type: String,
      enum: ["card", "cash_on_delivery"],
      default: "card",
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "paid",
        "failed",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },

    gatewayResponse: {
      type: Schema.Types.Mixed,
      default: {},
    },

    paidAt: Date,

    refundedAt: Date,
  },
  {
    timestamps: true,
  },
);

paymentSchema.pre("save", function (next) {
  if (!this.transactionId) {
    this.transactionId =
      "TXN" +
      Date.now().toString().slice(-8) +
      Math.floor(Math.random() * 900 + 100);
  }
});

paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });

const Payment = mongoose.model<IPayment, IPaymentModel>(
  "Payment",
  paymentSchema,
);

export default Payment;
