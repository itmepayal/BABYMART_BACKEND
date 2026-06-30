import { uploadToCloudinary } from "../../config/cloudinary.config";
import User, { IAddress } from "../../models/user.model";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/errors/app.error";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt/token.jwt";
import {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
} from "../../validators/auth.validation";

/* =========================
   Authentication Services
========================= */
export const registerService = async (data: RegisterInput) => {
  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    throw new ConflictError("Email already exists");
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
  });

  return user;
};

export const loginService = async (data: LoginInput) => {
  const user = await User.findOne({
    email: data.email,
  }).select("+password");

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  if (!user.isActive) {
    throw new UnauthorizedError("Your account has been deactivated.");
  }

  const isPasswordMatched = await user.matchPassword(data.password);

  if (!isPasswordMatched) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.password = undefined as never;

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const logoutService = async (userId: string) => {
  await User.findByIdAndUpdate(userId, {
    refreshToken: null,
  });
};

export const refreshTokenService = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken) as {
    id: string;
    email: string;
    role: string;
  };
  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user) {
    throw new UnauthorizedError("User not found.");
  }
  if (!user.refreshToken || user.refreshToken !== refreshToken) {
    throw new UnauthorizedError("Invalid refresh token.");
  }
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  const accessToken = generateAccessToken(payload);
  return {
    accessToken,
  };
};

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
export const addAddressService = async (userId: string, payload: IAddress) => {
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
