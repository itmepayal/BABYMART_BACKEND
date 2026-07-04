export const PROTECTED_FIELDS = [
  "vendor",
  "isApproved",
  "approvedBy",
  "approvedAt",
  "rejectionReason",
] as const;

export const PRODUCT_SORT_FIELDS = [
  "createdAt",
  "updatedAt",
  "title",
  "price",
  "rating",
  "sold",
] as const;

export function stripProtectedFields<T extends Record<string, unknown>>(
  payload: T,
) {
  const sanitized = { ...payload };
  for (const field of PROTECTED_FIELDS) {
    delete sanitized[field];
  }
  return sanitized;
}

export function normalizeProductCode<T extends { code?: string | undefined }>(
  payload: T,
) {
  if (typeof payload.code === "string" && payload.code.trim() === "") {
    payload.code = undefined;
  }
  return payload;
}

export function sanitizePagination(page = 1, limit = 10) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
}
