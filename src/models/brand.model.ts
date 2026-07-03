import mongoose, { Document, Model, Schema } from "mongoose";
import slugify from "slugify";

export interface IBrand extends Document {
  title: string;
  slug: string;
  image: string;

  createdAt: Date;
  updatedAt: Date;
}

interface IBrandModel extends Model<IBrand> {}

const brandSchema = new Schema<IBrand, IBrandModel>(
  {
    title: {
      type: String,
      required: [true, "Brand title is required"],
      trim: true,
      minlength: [2, "Brand title must be at least 2 characters"],
      maxlength: [50, "Brand title cannot exceed 50 characters"],
      unique: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    image: {
      type: String,
      required: [true, "Brand image is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

brandSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
});

brandSchema.index({ title: 1 });
brandSchema.index({ slug: 1 });

const Brand = mongoose.model<IBrand, IBrandModel>("Brand", brandSchema);

export default Brand;
