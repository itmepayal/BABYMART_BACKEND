import mongoose from "mongoose";
import User from "../../models/user.model";
import { NotFoundError } from "../../utils/errors/app.error";
import Cart from "../../models/cart.model";
import Wishlist from "../../models/wishlist.model";
import Review from "../../models/review.model";

/* =========================
   Admin User Management Services
========================= */
export const getAllUsersService = async (page = 1, limit = 10, search = "") => {
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password -refreshToken")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);
  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUserByIdService = async (userId: string) => {
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  return user;
};

export const updateUserRoleService = async (
  userId: string,
  role: "customer" | "vendor" | "admin",
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  user.role = role;
  await user.save();
  return user;
};

export const updateUserStatusService = async (
  userId: string,
  isActive: boolean,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  user.isActive = isActive;
  if (!isActive) {
    user.refreshToken = "";
  }
  await user.save();
  return user;
};

export const deleteUserService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await Cart.deleteOne({ user: user._id }).session(session);
    await Wishlist.deleteOne({ user: user._id }).session(session);
    await Review.deleteMany({ user: user._id }).session(session);
    await user.deleteOne({ session });
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
  return null;
};
