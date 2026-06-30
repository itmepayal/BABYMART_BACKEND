import mongoose, { Document, Model, Schema, Types } from "mongoose";
import slugify from "slugify";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  image: string;
  tags: string[];

  author: Types.ObjectId;

  excerpt: string;
  body: string;

  commentsCount: number;

  isPublished: boolean;
  publishedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

interface IBlogPostModel extends Model<IBlogPost> {}

const blogPostSchema = new Schema<IBlogPost, IBlogPostModel>(
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
      required: [true, "Image is required"],
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
    },

    body: {
      type: String,
      default: "",
    },

    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

blogPostSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
});

const BlogPost = mongoose.model<IBlogPost, IBlogPostModel>(
  "BlogPost",
  blogPostSchema,
);

export default BlogPost;
