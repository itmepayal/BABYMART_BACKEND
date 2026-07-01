import { StatusCodes } from "http-status-codes";
import { uploadToCloudinary } from "../../config/cloudinary.config";
import { AuthRequest } from "../../types/express";
import { BadRequestError } from "../../utils/errors/app.error";
import { apiResponse } from "../../utils/response/app.response";
import {
  createBlogPostService,
  deleteBlogPostService,
  getAllBlogPostsService,
  getBlogPostByIdService,
  getBlogPostBySlugService,
  updateBlogPostService,
} from "./blog.service";

/* =========================
   Blog Controllers
========================= */
export const createBlogPostController = async (
  req: AuthRequest,
): Promise<void> => {
  if (!req.file) {
    throw new BadRequestError("Blog image is required.");
  }
  const uploaded = await uploadToCloudinary(req.file.path, "babymart/blogs");
  const blog = await createBlogPostService({
    ...req.body,
    image: uploaded.url,
  });
  apiResponse(
    req.res!,
    StatusCodes.CREATED,
    "Blog post created successfully.",
    blog,
  );
};

export const getAllBlogPostsController = async (
  req: AuthRequest,
): Promise<void> => {
  const blogs = await getAllBlogPostsService({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: String(req.query.search || ""),
    author: req.query.author as string,
    tag: req.query.tag as string,
    isPublished:
      req.query.isPublished !== undefined
        ? req.query.isPublished === "true"
        : undefined,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder === "asc" ? "asc" : "desc",
  });

  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Blog posts fetched successfully.",
    blogs,
  );
};

export const getBlogPostByIdController = async (
  req: AuthRequest,
): Promise<void> => {
  const blog = await getBlogPostByIdService(req.params.blogPostId);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Blog post fetched successfully.",
    blog,
  );
};

export const getBlogPostBySlugController = async (
  req: AuthRequest,
): Promise<void> => {
  const blog = await getBlogPostBySlugService(req.params.slug);

  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Blog post fetched successfully.",
    blog,
  );
};

export const updateBlogPostController = async (
  req: AuthRequest,
): Promise<void> => {
  const payload: Record<string, any> = {
    ...req.body,
  };

  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file.path, "babymart/blogs");

    payload.image = uploaded.url;
  }

  const blog = await updateBlogPostService(req.params.blogPostId, payload);

  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Blog post updated successfully.",
    blog,
  );
};

export const deleteBlogPostController = async (
  req: AuthRequest,
): Promise<void> => {
  await deleteBlogPostService(req.params.blogPostId);

  apiResponse(req.res!, StatusCodes.OK, "Blog post deleted successfully.");
};
