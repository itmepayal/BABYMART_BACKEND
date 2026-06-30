import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  title: string;
  image: string;
  price: number;
  qty: number;
}

export interface ICart extends Document {
  user: Types.ObjectId;

  items: ICartItem[];

  couponCode?: string | null;
  discountAmount: number;

  subtotal: number;
  total: number;

  createdAt: Date;
  updatedAt: Date;
}

interface ICartModel extends Model<ICart> {}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    qty: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  {
    _id: true,
  },
);

const cartSchema = new Schema<ICart, ICartModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [cartItemSchema],

    couponCode: {
      type: String,
      default: null,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

cartSchema.virtual("subtotal").get(function (this: ICart): number {
  return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
});

cartSchema.virtual("total").get(function (this: ICart): number {
  return Math.max(this.subtotal - (this.discountAmount || 0), 0);
});

cartSchema.set("toJSON", {
  virtuals: true,
});

cartSchema.set("toObject", {
  virtuals: true,
});

const Cart = mongoose.model<ICart, ICartModel>("Cart", cartSchema);

export default Cart;
