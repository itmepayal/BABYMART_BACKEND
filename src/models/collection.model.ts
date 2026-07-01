import mongoose, { Model, Schema, Types } from "mongoose";
import slugify from "slugify";

export interface ICollection {
  slug: string;
  label: string;
  image: string;
  tint: string;
  categories: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new Schema<ICollection>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    tint: {
      type: String,
      default: "bg-coral-50",
      trim: true,
    },
    categories: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

collectionSchema.pre("validate", function (next) {
  if (this.label) {
    this.slug = slugify(this.label, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
});

collectionSchema.index(
  { label: 1 },
  {
    unique: true,
    collation: {
      locale: "en",
      strength: 2,
    },
  },
);

const Collection: Model<ICollection> = mongoose.model<ICollection>(
  "Collection",
  collectionSchema,
);

export default Collection;
