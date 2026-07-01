import { Router } from "express";
import {
  createCollectionController,
  getAllCollectionsController,
  getCollectionByIdController,
  updateCollectionController,
  deleteCollectionController,
} from "./collection.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";

export const collectionRouter = Router();

/* =========================
   Collection Management
========================= */
collectionRouter.get("/", getAllCollectionsController);
collectionRouter.get("/:collectionId", getCollectionByIdController);
collectionRouter.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  createCollectionController,
);
collectionRouter.patch(
  "/:collectionId",
  protect,
  authorize("admin"),
  upload.single("image"),
  updateCollectionController,
);
collectionRouter.delete(
  "/:collectionId",
  protect,
  authorize("admin"),
  deleteCollectionController,
);
