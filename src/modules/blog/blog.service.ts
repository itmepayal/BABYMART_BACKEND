import BlogPost from "../../models/blog.model";
import User from "../../models/user.model";
import { BadRequestError, NotFoundError } from "../../utils/errors/app.error";
import {
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from "../../validators/blog.validation";

/* =========================
   Helper Functions
========================= */
const validateAuthor = async (authorId: string) => {
  const exists = await User.exists({ _id: authorId });
  if (!exists) {
    throw new BadRequestError("Author not found.");
  }
};

const validateTitle = async (title: string, blogPostId?: string) => {
  const exists = await BlogPost.findOne({
    ...(blogPostId && { _id: { $ne: blogPostId } }),
    title: {
      $regex: new RegExp(`^${title.trim()}$`, "i"),
    },
  });

  if (exists) {
    throw new BadRequestError("Blog title already exists.");
  }
};

/* =========================
   Blog Services
========================= */
export const createBlogPostService = async (payload: CreateBlogPostInput) => {
  await validateAuthor(payload.author);
  await validateTitle(payload.title);
  return await BlogPost.create(payload);
};

export const getAllBlogPostsService = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  author?: string;
  tag?: string;
  isPublished?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    author,
    tag,
    isPublished,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        excerpt: {
          $regex: search,
          $options: "i",
        },
      },
      {
        body: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }
  if (author) {
    filter.author = author;
  }
  if (tag) {
    filter.tags = tag;
  }
  if (typeof isPublished === "boolean") {
    filter.isPublished = isPublished;
  }
  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };
  const [posts, total] = await Promise.all([
    BlogPost.find(filter)
      .populate("author", "-password")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    BlogPost.countDocuments(filter),
  ]);
  return {
    posts,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

export const getBlogPostByIdService = async (blogPostId: string) => {
  const post = await BlogPost.findById(blogPostId).populate(
    "author",
    "-password",
  );
  if (!post) {
    throw new NotFoundError("Blog post not found.");
  }
  return post;
};

export const getBlogPostBySlugService = async (slug: string) => {
  const post = await BlogPost.findOne({
    slug,
  }).populate("author", "-password");
  if (!post) {
    throw new NotFoundError("Blog post not found.");
  }
  return post;
};

export const updateBlogPostService = async (
  blogPostId: string,
  payload: UpdateBlogPostInput,
) => {
  const post = await BlogPost.findById(blogPostId);
  if (!post) {
    throw new NotFoundError("Blog post not found.");
  }
  if (payload.author) {
    await validateAuthor(payload.author);
  }
  if (payload.title) {
    await validateTitle(payload.title, blogPostId);
  }
  Object.assign(post, payload);
  await post.save();
  return await post.populate("author", "-password");
};

export const deleteBlogPostService = async (blogPostId: string) => {
  const post = await BlogPost.findByIdAndDelete(blogPostId);

  if (!post) {
    throw new NotFoundError("Blog post not found.");
  }

  return post;
};
