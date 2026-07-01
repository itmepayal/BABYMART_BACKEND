import { StatusCodes } from "http-status-codes";
import { AuthRequest } from "../../types/express";
import {
  changePasswordService,
  currentUserService,
  deleteAccountService,
  uploadAvatarService,
  addAddressService,
  getAddressesService,
  updateAddressService,
  deleteAddressService,
  setDefaultAddressService,
} from "./user.service";
import {
  BadRequestError,
  UnauthorizedError,
} from "../../utils/errors/app.error";
import { apiResponse } from "../../utils/response/app.response";

/* =========================
   User Profile Controllers
========================= */
export const getCurrentUser = async (req: AuthRequest): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError("User is not authenticated.");
  }
  const user = await currentUserService(req.user.id);
  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Current user fetched successfully.",
    user,
  );
};

export const uploadAvatarController = async (
  req: AuthRequest,
): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError("User is not authenticated.");
  }
  if (!req.file) {
    throw new BadRequestError("Please upload an avatar image.");
  }
  const user = await uploadAvatarService(req.user.id, req.file);
  apiResponse(req.res!, StatusCodes.OK, "Avatar uploaded successfully.", user);
};

/* =========================
   Account Controllers
========================= */
export const deleteAccountController = async (
  req: AuthRequest,
): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError("User is not authenticated.");
  }
  await deleteAccountService(req.user.id);
  apiResponse(req.res!, StatusCodes.OK, "Account deleted successfully.");
};

/* =========================
   Password Controllers
========================= */
export const changePasswordController = async (
  req: AuthRequest,
): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError("User is not authenticated.");
  }
  await changePasswordService(req.user.id, req.body);
  apiResponse(req.res!, StatusCodes.OK, "Password changed successfully.");
};

/* =========================
   Address Management Controllers
========================= */
export const addAddressController = async (req: AuthRequest): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError("User is not authenticated.");
  }

  const addresses = await addAddressService(req.user.id, req.body);

  apiResponse(
    req.res!,
    StatusCodes.CREATED,
    "Address added successfully.",
    addresses,
  );
};

export const getAddressesController = async (
  req: AuthRequest,
): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError("User is not authenticated.");
  }

  const addresses = await getAddressesService(req.user.id);

  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Addresses fetched successfully.",
    addresses,
  );
};

export const updateAddressController = async (
  req: AuthRequest,
): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError("User is not authenticated.");
  }

  const address = await updateAddressService(
    req.user.id,
    req.params.addressId,
    req.body,
  );

  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Address updated successfully.",
    address,
  );
};

export const deleteAddressController = async (
  req: AuthRequest,
): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError("User is not authenticated.");
  }

  const addresses = await deleteAddressService(
    req.user.id,
    req.params.addressId,
  );

  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Address deleted successfully.",
    addresses,
  );
};

export const setDefaultAddressController = async (
  req: AuthRequest,
): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError("User is not authenticated.");
  }

  const addresses = await setDefaultAddressService(
    req.user.id,
    req.params.addressId,
  );

  apiResponse(
    req.res!,
    StatusCodes.OK,
    "Default address updated successfully.",
    addresses,
  );
};
