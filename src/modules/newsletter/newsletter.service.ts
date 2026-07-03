import Newsletter from "../../models/newsletter.model";
import { BadRequestError, NotFoundError } from "../../utils/errors/app.error";
import {
  NewsletterInput,
  UpdateNewsletterInput,
} from "../../validators/newsletter.validation";

/* =========================
   Helper Functions
========================= */
const validateEmail = async (email: string, newsletterId?: string) => {
  const exists = await Newsletter.findOne({
    ...(newsletterId && { _id: { $ne: newsletterId } }),
    email: email.toLowerCase(),
  });

  if (exists) {
    throw new BadRequestError("Email is already subscribed.");
  }
};

/* =========================
   Newsletter Services
========================= */
export const createNewsletterService = async (payload: NewsletterInput) => {
  await validateEmail(payload.email);
  return await Newsletter.create({
    ...payload,
    email: payload.email.toLowerCase(),
    isSubscribed: true,
    subscribedAt: new Date(),
    unsubscribedAt: undefined,
  });
};

export const getAllNewslettersService = async (
  page = 1,
  limit = 10,
  search = "",
) => {
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = {};
  if (search) {
    filter.email = {
      $regex: search,
      $options: "i",
    };
  }
  const [newsletters, total] = await Promise.all([
    Newsletter.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Newsletter.countDocuments(filter),
  ]);
  return {
    newsletters,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getNewsletterByIdService = async (newsletterId: string) => {
  const newsletter = await Newsletter.findById(newsletterId);
  if (!newsletter) {
    throw new NotFoundError("Subscriber not found.");
  }
  return newsletter;
};

export const updateNewsletterService = async (
  newsletterId: string,
  payload: UpdateNewsletterInput,
) => {
  const newsletter = await Newsletter.findById(newsletterId);
  if (!newsletter) {
    throw new NotFoundError("Subscriber not found.");
  }
  if (payload.email) {
    await validateEmail(payload.email, newsletterId);
    payload.email = payload.email.toLowerCase();
  }
  if (payload.isSubscribed === false && newsletter.isSubscribed) {
    payload.unsubscribedAt = new Date();
  }
  if (payload.isSubscribed === true && !newsletter.isSubscribed) {
    payload.subscribedAt = new Date();
    payload.unsubscribedAt = undefined;
  }
  Object.assign(newsletter, payload);
  await newsletter.save();
  return newsletter;
};

export const unsubscribeNewsletterService = async (email: string) => {
  const newsletter = await Newsletter.findOne({
    email: email.toLowerCase(),
  });
  if (!newsletter) {
    throw new NotFoundError("Subscriber not found.");
  }
  newsletter.isSubscribed = false;
  newsletter.unsubscribedAt = new Date();
  await newsletter.save();
  return newsletter;
};

export const deleteNewsletterService = async (newsletterId: string) => {
  const newsletter = await Newsletter.findById(newsletterId);
  if (!newsletter) {
    throw new NotFoundError("Subscriber not found.");
  }
  await newsletter.deleteOne();
  return newsletter;
};
