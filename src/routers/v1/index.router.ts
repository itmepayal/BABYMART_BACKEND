import express from "express";
import { authRouter } from "../../modules/auth/auth.route";
import { adminRouter } from "../../modules/admin/admin.route";
import { userRouter } from "../../modules/user/user.route";
import { categoryRouter } from "../../modules/category/category.route";
import { collectionRouter } from "../../modules/collection/collection.route";
import { productRouter } from "../../modules/product/product.route";
import { couponRouter } from "../../modules/coupon/coupon.router";
import { cartRouter } from "../../modules/cart/cart.route";
import { wishlistRouter } from "../../modules/wishlist/wishlist.route";
import { aboutRouter } from "../../modules/about/about.route";
import { brandRouter } from "../../modules/brand/brand.route";
import { bannerRouter } from "../../modules/banner/banner.route";
import { newsletterRouter } from "../../modules/newsletter/newsletter.route";
import { contactRouter } from "../../modules/contact/contact.route";
import { vendorRouter } from "../../modules/vendor/vendor.route";
import { blogRouter } from "../../modules/blog/blog.route";

const v1Router = express.Router();

v1Router.use("/account", authRouter);
v1Router.use("/users", userRouter);
v1Router.use("/admin", adminRouter);
v1Router.use("/vendors", vendorRouter);
v1Router.use("/products", productRouter);
v1Router.use("/categories", categoryRouter);
v1Router.use("/collections", collectionRouter);
v1Router.use("/coupons", couponRouter);
v1Router.use("/cart", cartRouter);
v1Router.use("/wishlist", wishlistRouter);
v1Router.use("/about", aboutRouter);
v1Router.use("/brands", brandRouter);
v1Router.use("/banners", bannerRouter);
v1Router.use("/blogs", blogRouter);
v1Router.use("/newsletters", newsletterRouter);
v1Router.use("/contacts", contactRouter);

export default v1Router;
