import { uploadToCloudinary } from "../../config/cloudinary.config";
import User, { IAddress } from "../../models/user.model";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/errors/app.error";
import {
  addressesInput,
  ChangePasswordInput,
} from "../../validators/auth.validation";

/* =========================
   User Profile Services
========================= */
export const currentUserService = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  return user;
};

export const uploadAvatarService = async (
  userId: string,
  file: Express.Multer.File,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  const image = await uploadToCloudinary(file.path, "babymart/users");
  user.avatar = image.url;
  await user.save();
  return user;
};

export const deleteAccountService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  user.isActive = false;
  user.refreshToken = "";
  await user.save();
};

/* =========================
   Password Services
========================= */
export const changePasswordService = async (
  userId: string,
  payload: ChangePasswordInput,
) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  const isMatch = await user.matchPassword(payload.currentPassword);
  if (!isMatch) {
    throw new UnauthorizedError("Current password is incorrect.");
  }
  const isSamePassword = await user.matchPassword(payload.newPassword);
  if (isSamePassword) {
    throw new BadRequestError(
      "New password must be different from the current password.",
    );
  }
  user.password = payload.newPassword;
  await user.save();
};

/* =========================
   Address Management Services
========================= */
export const addAddressService = async (
  userId: string,
  payload: addressesInput,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  if (payload.isDefault) {
    user.addresses.forEach((address) => {
      address.isDefault = false;
    });
  }
  user.addresses.push(payload);
  await user.save();
  return user.addresses;
};

export const getAddressesService = async (userId: string) => {
  const user = await User.findById(userId).select("addresses");
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  return user.addresses;
};

export const updateAddressService = async (
  userId: string,
  addressId: string,
  payload: Partial<IAddress>,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  const address = user.addresses.find(
    (addr) => addr._id?.toString() === addressId,
  );
  if (!address) {
    throw new NotFoundError("Address not found.");
  }
  if (payload.isDefault) {
    user.addresses.forEach((item) => {
      item.isDefault = false;
    });
  }
  Object.assign(address, payload);
  await user.save();
  return address;
};

export const deleteAddressService = async (
  userId: string,
  addressId: string,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  const address = user.addresses.find(
    (addr) => addr._id?.toString() === addressId,
  );
  if (!address) {
    throw new NotFoundError("Address not found.");
  }
  const wasDefault = address.isDefault;
  user.addresses = user.addresses.filter(
    (addr) => addr._id?.toString() !== addressId,
  );
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }
  await user.save();
  return user.addresses;
};

export const setDefaultAddressService = async (
  userId: string,
  addressId: string,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  const address = user.addresses.find(
    (addr) => addr._id?.toString() === addressId,
  );
  if (!address) {
    throw new NotFoundError("Address not found.");
  }
  user.addresses.forEach((item) => {
    item.isDefault = false;
  });
  address.isDefault = true;
  await user.save();
  return user.addresses;
};
