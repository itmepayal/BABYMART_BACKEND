import mongoose, { Document, Model, Schema } from "mongoose";

export interface INewsletter extends Document {
  email: string;

  isSubscribed: boolean;

  subscribedAt?: Date;
  unsubscribedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

interface INewsletterModel extends Model<INewsletter> {}

const newsletterSchema = new Schema<INewsletter, INewsletterModel>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    isSubscribed: {
      type: Boolean,
      default: true,
    },

    subscribedAt: {
      type: Date,
      default: Date.now,
    },

    unsubscribedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

newsletterSchema.index({ email: 1 });

const Newsletter = mongoose.model<INewsletter, INewsletterModel>(
  "Newsletter",
  newsletterSchema,
);

export default Newsletter;
