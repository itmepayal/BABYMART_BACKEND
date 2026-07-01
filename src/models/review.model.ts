import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IReview extends Document {
  product: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface IReviewModel extends Model<IReview> {
  recalculateProductRating(productId: Types.ObjectId): Promise<void>;
}

const reviewSchema = new Schema<IReview, IReviewModel>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.recalculateProductRating = async function (
  productId: Types.ObjectId,
): Promise<void> {
  const Product = mongoose.model("Product");

  const stats = await this.aggregate([
    {
      $match: {
        product: productId,
        isApproved: true,
      },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviews: stats[0].count,
      reviewCount: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      reviews: 0,
      reviewCount: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await (this.constructor as IReviewModel).recalculateProductRating(
    this.product,
  );
});

reviewSchema.post("findOneAndDelete", async function (doc: IReview | null) {
  if (doc) {
    await (doc.constructor as IReviewModel).recalculateProductRating(
      doc.product,
    );
  }
});

const Review = mongoose.model<IReview, IReviewModel>("Review", reviewSchema);

export default Review;
