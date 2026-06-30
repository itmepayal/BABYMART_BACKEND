import mongoose, { Document, Model, Schema, Types } from "mongoose";
import slugify from "slugify";

export interface IOffer {
  icon: "shipping" | "membership" | "safe" | "returns";
  label: string;
}

export interface IBadge {
  label?: string;
  tone?: "" | "new" | "sale" | "hot" | "bestseller";
}

export interface ICountdown {
  enabled: boolean;
  endsAt?: Date;
}

export interface IProduct extends Document {
  title: string;
  slug: string;

  image: string;
  images: string[];

  price: number;
  oldPrice?: number;

  rating: number;
  reviews: number;
  reviewCount: number;
  sold: number;

  badge?: IBadge;
  discountBadge?: string;

  inStock: boolean;
  stockQuantity: number;

  productType?: string;
  vendor: Types.ObjectId;
  code?: string;

  categories: string[];
  collections: string[];
  tags: string[];

  offers: IOffer[];

  description: string;

  weight?: string;
  dimensions?: string;

  isFeatured: boolean;
  isActive: boolean;

  countdown: ICountdown;

  createdAt: Date;
  updatedAt: Date;

  discountPercent: number;
}

interface IProductModel extends Model<IProduct> {}

const offerSchema = new Schema<IOffer>(
  {
    icon: {
      type: String,
      enum: ["shipping", "membership", "safe", "returns"],
      default: "shipping",
    },
    label: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const productSchema = new Schema<IProduct, IProductModel>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    image: {
      type: String,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    oldPrice: {
      type: Number,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    sold: {
      type: Number,
      default: 0,
    },

    badge: {
      label: String,
      tone: {
        type: String,
        enum: ["", "new", "sale", "hot", "bestseller"],
        default: "",
      },
    },

    discountBadge: String,

    inStock: {
      type: Boolean,
      default: true,
    },

    stockQuantity: {
      type: Number,
      default: 100,
      min: 0,
    },

    productType: String,
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    code: {
      type: String,
      unique: true,
      sparse: true,
    },

    categories: [
      {
        type: String,
        index: true,
      },
    ],

    collections: [
      {
        type: String,
        index: true,
      },
    ],

    tags: [
      {
        type: String,
      },
    ],

    offers: [offerSchema],

    description: {
      type: String,
      default: "",
    },

    weight: String,

    dimensions: String,

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    countdown: {
      enabled: {
        type: Boolean,
        default: false,
      },
      endsAt: Date,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({
  title: "text",
  description: "text",
});

productSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug =
      slugify(this.title, {
        lower: true,
        strict: true,
      }) +
      "-" +
      Date.now().toString(36).slice(-4);
  }
});

productSchema.virtual("discountPercent").get(function (this: IProduct) {
  if (this.oldPrice && this.oldPrice > this.price) {
    return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
  }

  return 0;
});

productSchema.set("toJSON", {
  virtuals: true,
});

productSchema.set("toObject", {
  virtuals: true,
});

const Product = mongoose.model<IProduct, IProductModel>(
  "Product",
  productSchema,
);

export default Product;
