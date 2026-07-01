import { Router } from "express";
import multer from "multer";
import { protect, authorize } from "../../middlewares/auth.middleware";
import { validateRequestBody } from "../../validators";
import {
  createBlogPostSchema,
  updateBlogPostSchema,
} from "../../validators/blog.validation";
import {
  createBlogPostController,
  deleteBlogPostController,
  getAllBlogPostsController,
  getBlogPostByIdController,
  getBlogPostBySlugController,
  updateBlogPostController,
} from "./blog.controller";

const upload = multer({ dest: "uploads/" });

export const blogRouter = Router();

/* =========================
   Blog Posts
========================= */
blogRouter.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  validateRequestBody(createBlogPostSchema),
  createBlogPostController,
);
blogRouter.get("/", getAllBlogPostsController);
blogRouter.get("/slug/:slug", getBlogPostBySlugController);
blogRouter.get("/:blogPostId", getBlogPostByIdController);
blogRouter.patch(
  "/:blogPostId",
  protect,
  authorize("admin"),
  upload.single("image"),
  validateRequestBody(updateBlogPostSchema),
  updateBlogPostController,
);
blogRouter.delete(
  "/:blogPostId",
  protect,
  authorize("admin"),
  deleteBlogPostController,
);

export default blogRouter;
