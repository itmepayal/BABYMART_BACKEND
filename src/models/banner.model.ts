import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBanner extends Document {
  images: string[];
  subBannerOne: string;
  subBannerTwo: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IBannerModel extends Model<IBanner> {}

const bannerSchema = new Schema<IBanner, IBannerModel>(
  {
    images: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    subBannerOne: {
      type: String,
      required: [true, "Sub Banner One image is required"],
      trim: true,
    },

    subBannerTwo: {
      type: String,
      required: [true, "Sub Banner Two image is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Banner = mongoose.model<IBanner, IBannerModel>("Banner", bannerSchema);

export default Banner;
