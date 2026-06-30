import express from "express";
import { authRouter } from "../../modules/auth/auth.route";
import adminRouter from "../../modules/admin/admin.route";

const v1Router = express.Router();

v1Router.use("/account", authRouter);
v1Router.use("/admin", adminRouter);

export default v1Router;
