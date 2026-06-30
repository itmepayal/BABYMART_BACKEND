import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../../types/express";
import {
  getAllUsersService,
  getUserByIdService,
  updateUserRoleService,
  updateUserStatusService,
  deleteUserService,
} from "./admin.service";
import { apiResponse } from "../../utils/response/app.response";

/* =========================
   Admin User Management Controllers
========================= */
export const getAllUsersController = async (
  req: AuthRequest,
): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = String(req.query.search || "");
  const users = await getAllUsersService(page, limit, search);
  apiResponse(req.res!, StatusCodes.OK, "Users fetched successfully.", users);
};

export const getUserByIdController = async (
  req: AuthRequest,
): Promise<void> => {
  const user = await getUserByIdService(req.params.userId);
  apiResponse(req.res!, StatusCodes.OK, "User fetched successfully.", user);
};

export const updateUserRoleController = async (
  req: AuthRequest,
): Promise<void> => {
  const { role } = req.body;
  const user = await updateUserRoleService(req.params.userId, role);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "User role updated successfully.",
    user,
  );
};

export const updateUserStatusController = async (
  req: AuthRequest,
): Promise<void> => {
  const { isActive } = req.body;
  const user = await updateUserStatusService(req.params.userId, isActive);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    isActive ? "User unblocked successfully." : "User blocked successfully.",
    user,
  );
};

export const deleteUserController = async (req: AuthRequest): Promise<void> => {
  await deleteUserService(req.params.userId);
  apiResponse(req.res!, StatusCodes.OK, "User deleted successfully.");
};
