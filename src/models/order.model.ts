import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  image?: string;
  qty: number;
  price: number;
}

export interface IAddressSnapshot {
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface IPaymentResult {
  id?: string;
  status?: string;
  update_time?: string;
  email_address?: string;
}

export interface IStatusHistory {
  status: string;
  note?: string;
  changedAt: Date;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: Types.ObjectId;

  items: IOrderItem[];

  shippingAddress: IAddressSnapshot;
  shippingMethod: "flat_rate" | "local_pickup" | "free";
  shippingCost: number;

  itemsPrice: number;
  discountAmount: number;
  taxPrice: number;
  totalPrice: number;

  couponCode?: string;

  paymentMethod: "stripe" | "cod";
  paymentResult?: IPaymentResult;

  isPaid: boolean;
  paidAt?: Date;

  orderStatus:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";

  statusHistory: IStatusHistory[];

  isDelivered: boolean;
  deliveredAt?: Date;

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const addressSnapshotSchema = new Schema<IAddressSnapshot>(
  {
    fullName: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  {
    _id: false,
  },
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: (items: IOrderItem[]) => items.length > 0,
    },

    shippingAddress: {
      type: addressSnapshotSchema,
      required: true,
    },

    shippingMethod: {
      type: String,
      enum: ["flat_rate", "local_pickup", "free"],
      default: "flat_rate",
    },

    shippingCost: {
      type: Number,
      default: 0,
    },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    taxPrice: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    couponCode: {
      type: String,
    },

    paymentMethod: {
      type: String,
      enum: ["stripe", "cod"],
      default: "stripe",
    },

    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },

    statusHistory: [
      {
        status: String,
        note: String,
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
    },

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber =
      "KX" +
      Date.now().toString().slice(-8) +
      Math.floor(Math.random() * 900 + 100);
  }
});

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
