import mongoose, { Document, Model, Schema } from "mongoose";
import slugify from "slugify";

export interface ICollection extends Document {
  slug: string;
  label: string;
  image: string;
  tint: string;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

const collectionSchema = new Schema<ICollection>(
  {
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    tint: {
      type: String,
      default: "bg-coral-50",
    },
    categories: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

collectionSchema.pre("validate", function (next) {
  if (!this.slug && this.label) {
    this.slug = slugify(this.label, {
      lower: true,
      strict: true,
    });
  }
});

const Collection: Model<ICollection> = mongoose.model<ICollection>(
  "Collection",
  collectionSchema,
);

export default Collection;
