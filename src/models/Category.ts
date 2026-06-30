import mongoose, { Document, Model, Schema } from "mongoose";
import slugify from "slugify";

export interface ICategory extends Document {
  label: string;
  slug: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.pre("validate", function (next) {
  if (this.label) {
    this.slug = slugify(this.label, {
      lower: true,
      strict: true,
    });
  }
});

const Category: Model<ICategory> = mongoose.model<ICategory>(
  "Category",
  categorySchema,
);

export default Category;
