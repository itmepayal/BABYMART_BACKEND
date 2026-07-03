import Contact from "../../models/contact.model";
import { NotFoundError } from "../../utils/errors/app.error";
import {
  ContactInput,
  UpdateContactInput,
} from "../../validators/contact.validation";

/* =========================
   Contact Services
========================= */
export const createContactService = async (payload: ContactInput) => {
  const existing = await Contact.findOne();
  if (existing) {
    Object.assign(existing, payload);
    await existing.save();
    return existing;
  }
  return await Contact.create(payload);
};

export const getContactService = async () => {
  const contact = await Contact.findOne();
  if (!contact) {
    throw new NotFoundError("Contact information not found.");
  }
  return contact;
};

export const updateContactService = async (payload: UpdateContactInput) => {
  const contact = await Contact.findOne();
  if (!contact) {
    throw new NotFoundError("Contact information not found.");
  }
  Object.assign(contact, payload);
  await contact.save();
  return contact;
};
