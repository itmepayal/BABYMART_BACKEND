import { Router } from "express";
import {
  createContactController,
  getContactController,
  updateContactController,
} from "./contact.controller";
import { protect, authorize } from "../../middlewares/auth.middleware";

export const contactRouter = Router();

/* =========================
   Contact Routes
========================= */
contactRouter.post("/", protect, authorize("admin"), createContactController);
contactRouter.get("/", getContactController);
contactRouter.put("/", protect, authorize("admin"), updateContactController);
