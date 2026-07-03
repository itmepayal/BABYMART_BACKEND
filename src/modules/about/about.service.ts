import About from "../../models/about.model";
import { NotFoundError } from "../../utils/errors/app.error";
import { AboutInput } from "../../validators/about.validation";

/* =========================
   About Services
========================= */
export const createAboutService = async (payload: AboutInput) => {
  const existing = await About.findOne();
  if (existing) {
    Object.assign(existing, payload);
    await existing.save();
    return existing;
  }
  return await About.create(payload);
};

export const getAboutService = async () => {
  const about = await About.findOne();
  if (!about) {
    throw new NotFoundError("About page not found.");
  }
  return about;
};

export const updateAboutService = async (payload: AboutInput) => {
  const about = await About.findOne();
  if (!about) {
    throw new NotFoundError("About page not found.");
  }
  Object.assign(about, payload);
  await about.save();
  return about;
};
