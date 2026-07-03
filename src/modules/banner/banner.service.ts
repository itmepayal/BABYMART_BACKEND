import Banner from "../../models/banner.model";
import { NotFoundError } from "../../utils/errors/app.error";
import { BannerInput } from "../../validators/banner.validation";

/* =========================
   Banner Services
========================= */
export const createBannerService = async (payload: BannerInput) => {
  const existing = await Banner.findOne();
  if (existing) {
    Object.assign(existing, payload);
    await existing.save();
    return existing;
  }
  return await Banner.create(payload);
};

export const getBannerService = async () => {
  const banner = await Banner.findOne();
  if (!banner) {
    throw new NotFoundError("Banner not found.");
  }
  return banner;
};

export const updateBannerService = async (payload: BannerInput) => {
  const banner = await Banner.findOne();
  if (!banner) {
    throw new NotFoundError("Banner not found.");
  }
  Object.assign(banner, payload);
  await banner.save();
  return banner;
};
