import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IInvoice extends Document {
  invoiceNumber: string;

  order: Types.ObjectId;
  user: Types.ObjectId;

  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;

  currency: string;

  status: "draft" | "issued" | "cancelled";

  issuedAt: Date;

  pdfUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}

interface IInvoiceModel extends Model<IInvoice> {}

const invoiceSchema = new Schema<IInvoice, IInvoiceModel>(
  {
    invoiceNumber: {
      type: String,
      unique: true,
    },

    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    shipping: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },

    status: {
      type: String,
      enum: ["draft", "issued", "cancelled"],
      default: "issued",
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    pdfUrl: String,
  },
  {
    timestamps: true,
  },
);

invoiceSchema.pre("save", function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber =
      "INV" +
      Date.now().toString().slice(-8) +
      Math.floor(Math.random() * 900 + 100);
  }
});

invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ order: 1 });
invoiceSchema.index({ user: 1 });

const Invoice = mongoose.model<IInvoice, IInvoiceModel>(
  "Invoice",
  invoiceSchema,
);

export default Invoice;
