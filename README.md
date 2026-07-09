# 🛒 Multi-Vendor E-Commerce API Documentation

A complete REST API reference for a multi-vendor marketplace backend (Amazon / Flipkart / Meesho style) with four access roles: **Public (Guest)**, **Customer**, **Vendor**, and **Admin**.

|                     |                                     |
| ------------------- | ----------------------------------- |
| **Base URL**        | `https://api.yourdomain.com/v1`     |
| **Total APIs**      | ≈ 145                               |
| **MVP APIs**        | ≈ 100–105                           |
| **Auth Type**       | Bearer JWT (Access + Refresh Token) |
| **Response Format** | JSON                                |

---

## 📑 Table of Contents

1. [Conventions](#-conventions)
2. [Authentication](#-authentication)
3. [Standard Response Format](#-standard-response-format)
4. [Public APIs (Guest)](#1-public-apis-guest-)
5. [Customer APIs](#2-customer-apis-)
6. [Vendor APIs](#3-vendor-apis-)
7. [Admin APIs](#4-admin-apis-)
8. [Role Permission Matrix](#-role-permission-matrix)
9. [Full API Count Summary](#-full-api-count-summary)
10. [Minimum MVP Scope](#-minimum-mvp-recommended)
11. [Suggested Tech Stack](#️-suggested-tech-stack)

---

## 📌 Conventions

| Symbol | Meaning                    |
| ------ | -------------------------- |
| 🔓     | No authentication required |
| 🔐     | Authentication required    |
| 👤     | Customer role              |
| 🏪     | Vendor role                |
| 🛠️     | Admin role                 |

**Route params** — `:id` / `:slug` in a path means "replace with the actual value."
**Query params** — used on `GET` list endpoints for filtering, sorting, and pagination (see each module).

### Common List Query Parameters

Most `GET` list endpoints (Products, Orders, Users, Reviews, etc.) support:

| Param                   | Type   | Description                              | Example                      |
| ----------------------- | ------ | ---------------------------------------- | ---------------------------- |
| `page`                  | number | Page number (default `1`)                | `?page=2`                    |
| `limit`                 | number | Items per page (default `20`, max `100`) | `?limit=50`                  |
| `sort`                  | string | Sort field, prefix `-` for descending    | `?sort=-createdAt`           |
| `search`                | string | Free-text search                         | `?search=shoes`              |
| `status`                | string | Filter by status                         | `?status=pending`            |
| `minPrice` / `maxPrice` | number | Price range (Products only)              | `?minPrice=100&maxPrice=999` |
| `category` / `brand`    | string | Filter by slug/id (Products only)        | `?category=footwear`         |

---

## 🔑 Authentication

All 🔐 routes require a header:

```
Authorization: Bearer <access_token>
```

| Flow               | Endpoint                       | Notes                                                             |
| ------------------ | ------------------------------ | ----------------------------------------------------------------- |
| Get tokens         | `POST /api/auth/login`         | Returns `accessToken` (short-lived) + `refreshToken` (long-lived) |
| Renew tokens       | `POST /api/auth/refresh-token` | Send `refreshToken` in body to get a new `accessToken`            |
| Invalidate session | `POST /api/auth/logout` 🔐     | Requires valid access token; revokes the refresh token            |

**Role enforcement** happens via middleware after JWT verification — e.g. `authenticate → authorize('vendor')`. A Customer token hitting a `/api/vendor/*` or `/api/admin/*` route should return `403 Forbidden`.

---

## 📦 Standard Response Format

**Success**

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": {},
  "meta": { "page": 1, "limit": 20, "total": 134 }
}
```

**Error**

```json
{
  "success": false,
  "message": "Invalid or expired token",
  "errorCode": "AUTH_TOKEN_EXPIRED",
  "errors": []
}
```

### Common HTTP Status Codes

| Code  | Meaning               | Typical Use                                     |
| ----- | --------------------- | ----------------------------------------------- |
| `200` | OK                    | Successful GET/PUT/DELETE                       |
| `201` | Created               | Successful POST creating a resource             |
| `400` | Bad Request           | Validation failure                              |
| `401` | Unauthorized          | Missing/invalid/expired token                   |
| `403` | Forbidden             | Valid token, wrong role                         |
| `404` | Not Found             | Resource doesn't exist                          |
| `409` | Conflict              | Duplicate entry (e.g. email already registered) |
| `422` | Unprocessable Entity  | Semantic validation error                       |
| `429` | Too Many Requests     | Rate limit hit                                  |
| `500` | Internal Server Error | Unhandled server error                          |

---

## 1. Public APIs (Guest) 🔓

No login required. **Total: 25 APIs**

### Auth — 7 endpoints

| Method | Endpoint                    | Description                                 |
| ------ | --------------------------- | ------------------------------------------- |
| POST   | `/api/auth/register`        | Register a new account                      |
| POST   | `/api/auth/login`           | Login, returns access + refresh token       |
| POST   | `/api/auth/refresh-token`   | Exchange refresh token for new access token |
| POST   | `/api/auth/forgot-password` | Send password-reset email/OTP               |
| POST   | `/api/auth/reset-password`  | Reset password using token/OTP              |
| POST   | `/api/auth/verify-email`    | Verify email via token/OTP                  |
| POST   | `/api/auth/logout` 🔐       | Revoke refresh token / end session          |

> Grouped as 6 in the module summary since Logout technically requires an authenticated session, but is listed here for flow completeness.

### Banner — 1 endpoint

| Method | Endpoint       | Description                 |
| ------ | -------------- | --------------------------- |
| GET    | `/api/banners` | Get active homepage banners |

### Brand — 2 endpoints

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/brands`       | List all brands   |
| GET    | `/api/brands/:slug` | Get brand by slug |

### Category — 2 endpoints

| Method | Endpoint                | Description                                |
| ------ | ----------------------- | ------------------------------------------ |
| GET    | `/api/categories`       | List all categories (supports nested tree) |
| GET    | `/api/categories/:slug` | Get category by slug                       |

### Collection — 2 endpoints

| Method | Endpoint                 | Description            |
| ------ | ------------------------ | ---------------------- |
| GET    | `/api/collections`       | List all collections   |
| GET    | `/api/collections/:slug` | Get collection by slug |

### Product — 7 endpoints

| Method | Endpoint                    | Description                                              |
| ------ | --------------------------- | -------------------------------------------------------- |
| GET    | `/api/products`             | List products (paginated, filterable — see query params) |
| GET    | `/api/products/:id`         | Get product details                                      |
| GET    | `/api/products/search?q=`   | Full-text product search                                 |
| GET    | `/api/products/featured`    | Get featured products                                    |
| GET    | `/api/products/:id/related` | Get related products                                     |
| GET    | `/api/products/new-arrival` | Get new arrivals                                         |
| GET    | `/api/products/best-seller` | Get best sellers                                         |

### Blog — 2 endpoints

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/api/blogs`       | List blog posts       |
| GET    | `/api/blogs/:slug` | Get blog post by slug |

### About — 1 endpoint

| Method | Endpoint     | Description                 |
| ------ | ------------ | --------------------------- |
| GET    | `/api/about` | Get "About Us" page content |

### Contact — 1 endpoint

| Method | Endpoint       | Description                                   |
| ------ | -------------- | --------------------------------------------- |
| GET    | `/api/contact` | Get contact info (address, phone, email, map) |

### Newsletter — 1 endpoint

| Method | Endpoint                    | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| POST   | `/api/newsletter/subscribe` | Subscribe an email to the newsletter |

---

## 2. Customer APIs 👤🔐

All routes require a valid Customer access token. **Total: ≈35 APIs**

### Profile — 5 endpoints

| Method | Endpoint                        | Description                       |
| ------ | ------------------------------- | --------------------------------- |
| GET    | `/api/customer/profile`         | Get logged-in profile             |
| PUT    | `/api/customer/profile`         | Update name/phone/DOB/etc.        |
| PUT    | `/api/customer/change-password` | Change password                   |
| POST   | `/api/customer/avatar`          | Upload/replace avatar (multipart) |
| DELETE | `/api/customer/account`         | Delete/deactivate account         |

### Address — 5 endpoints

| Method | Endpoint                              | Description             |
| ------ | ------------------------------------- | ----------------------- |
| POST   | `/api/customer/addresses`             | Add a new address       |
| GET    | `/api/customer/addresses`             | List saved addresses    |
| PUT    | `/api/customer/addresses/:id`         | Update an address       |
| DELETE | `/api/customer/addresses/:id`         | Delete an address       |
| PUT    | `/api/customer/addresses/:id/default` | Mark address as default |

### Cart — 7 endpoints

| Method | Endpoint                    | Description           |
| ------ | --------------------------- | --------------------- |
| GET    | `/api/customer/cart`        | Get current cart      |
| POST   | `/api/customer/cart`        | Add item to cart      |
| PUT    | `/api/customer/cart/:id`    | Update item quantity  |
| DELETE | `/api/customer/cart/:id`    | Remove one item       |
| DELETE | `/api/customer/cart`        | Clear entire cart     |
| POST   | `/api/customer/cart/coupon` | Apply coupon code     |
| DELETE | `/api/customer/cart/coupon` | Remove applied coupon |

### Wishlist — 4 endpoints

| Method | Endpoint                     | Description             |
| ------ | ---------------------------- | ----------------------- |
| GET    | `/api/customer/wishlist`     | Get wishlist            |
| POST   | `/api/customer/wishlist`     | Add product to wishlist |
| DELETE | `/api/customer/wishlist/:id` | Remove one item         |
| DELETE | `/api/customer/wishlist`     | Clear wishlist          |

### Review — 4 endpoints

| Method | Endpoint                    | Description          |
| ------ | --------------------------- | -------------------- |
| POST   | `/api/customer/reviews`     | Add a product review |
| PUT    | `/api/customer/reviews/:id` | Update own review    |
| DELETE | `/api/customer/reviews/:id` | Delete own review    |
| GET    | `/api/customer/reviews`     | List own reviews     |

### Orders — 5 endpoints

| Method | Endpoint                          | Description                                     |
| ------ | --------------------------------- | ----------------------------------------------- |
| POST   | `/api/customer/checkout`          | Validate cart, compute totals, prep for payment |
| POST   | `/api/customer/orders`            | Place order (after payment/COD confirmation)    |
| GET    | `/api/customer/orders`            | List own orders                                 |
| GET    | `/api/customer/orders/:id`        | Get order details                               |
| PUT    | `/api/customer/orders/:id/cancel` | Cancel an order                                 |

### Payment — 3 endpoints

| Method | Endpoint                        | Description                    |
| ------ | ------------------------------- | ------------------------------ |
| POST   | `/api/customer/payment/stripe`  | Create a Stripe payment intent |
| POST   | `/api/customer/payment/verify`  | Verify/confirm payment status  |
| GET    | `/api/customer/payment/history` | List past payments             |

### Invoice — 2 endpoints

| Method | Endpoint                              | Description          |
| ------ | ------------------------------------- | -------------------- |
| GET    | `/api/customer/invoices`              | List own invoices    |
| GET    | `/api/customer/invoices/:id/download` | Download invoice PDF |

---

## 3. Vendor APIs 🏪🔐

A vendor can only view/manage their **own** products, orders, and payouts. **Total: ≈16 APIs**

### Vendor Profile — 3 endpoints

| Method | Endpoint              | Description                              |
| ------ | --------------------- | ---------------------------------------- |
| POST   | `/api/vendor/profile` | Create vendor/store profile (onboarding) |
| GET    | `/api/vendor/profile` | Get own store profile                    |
| PUT    | `/api/vendor/profile` | Update store profile                     |

### Products — 5 endpoints

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| POST   | `/api/vendor/products`     | Create a product        |
| PUT    | `/api/vendor/products/:id` | Update own product      |
| DELETE | `/api/vendor/products/:id` | Delete own product      |
| GET    | `/api/vendor/products`     | List own products       |
| GET    | `/api/vendor/products/:id` | Get own product details |

### Orders — 3 endpoints

| Method | Endpoint                        | Description                                         |
| ------ | ------------------------------- | --------------------------------------------------- |
| GET    | `/api/vendor/orders`            | List orders containing own products                 |
| GET    | `/api/vendor/orders/:id`        | Get order details                                   |
| PUT    | `/api/vendor/orders/:id/status` | Update fulfilment status (packed/shipped/delivered) |

### Dashboard — 3 endpoints

| Method | Endpoint                              | Description                           |
| ------ | ------------------------------------- | ------------------------------------- |
| GET    | `/api/vendor/dashboard/summary`       | Total sales, orders, revenue snapshot |
| GET    | `/api/vendor/dashboard/monthly-sales` | Monthly sales chart data              |
| GET    | `/api/vendor/dashboard/recent-orders` | Latest orders                         |

### Payout — 2 endpoints

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| GET    | `/api/vendor/payouts`     | List payout history |
| GET    | `/api/vendor/payouts/:id` | Get payout details  |

---

## 4. Admin APIs 🛠️🔐

Full platform control. **Total: ≈69 APIs**

### Dashboard — 4 endpoints

| Method | Endpoint                               | Description                      |
| ------ | -------------------------------------- | -------------------------------- |
| GET    | `/api/admin/dashboard/stats`           | Platform-wide KPI stats          |
| GET    | `/api/admin/dashboard/recent-orders`   | Latest orders across all vendors |
| GET    | `/api/admin/dashboard/recent-users`    | Newest registered users          |
| GET    | `/api/admin/dashboard/sales-analytics` | Sales trends/analytics           |

### Users — 5 endpoints

| Method | Endpoint                     | Description        |
| ------ | ---------------------------- | ------------------ |
| GET    | `/api/admin/users`           | List all users     |
| GET    | `/api/admin/users/:id`       | Get user details   |
| PUT    | `/api/admin/users/:id`       | Update user        |
| DELETE | `/api/admin/users/:id`       | Delete user        |
| PUT    | `/api/admin/users/:id/block` | Block/unblock user |

### Vendors — 5 endpoints

| Method | Endpoint                         | Description                   |
| ------ | -------------------------------- | ----------------------------- |
| GET    | `/api/admin/vendors`             | List all vendors              |
| GET    | `/api/admin/vendors/:id`         | Get vendor details            |
| PUT    | `/api/admin/vendors/:id/approve` | Approve vendor onboarding     |
| PUT    | `/api/admin/vendors/:id/reject`  | Reject vendor onboarding      |
| PUT    | `/api/admin/vendors/:id/disable` | Disable a vendor's storefront |

### Products — 5 endpoints

| Method | Endpoint                          | Description                        |
| ------ | --------------------------------- | ---------------------------------- |
| GET    | `/api/admin/products`             | List all products (any vendor)     |
| GET    | `/api/admin/products/:id`         | Get product details                |
| PUT    | `/api/admin/products/:id/approve` | Approve a vendor-submitted product |
| PUT    | `/api/admin/products/:id/reject`  | Reject a vendor-submitted product  |
| DELETE | `/api/admin/products/:id`         | Delete any product                 |

### Categories, Brands, Collections, Banner, Blog, Coupons — CRUD (5 each = 30)

All six modules follow the identical CRUD pattern:

| Method | Endpoint Pattern            | Description   |
| ------ | --------------------------- | ------------- |
| GET    | `/api/admin/{resource}`     | List all      |
| POST   | `/api/admin/{resource}`     | Create new    |
| GET    | `/api/admin/{resource}/:id` | Get one by id |
| PUT    | `/api/admin/{resource}/:id` | Update one    |
| DELETE | `/api/admin/{resource}/:id` | Delete one    |

Where `{resource}` is one of: `categories`, `brands`, `collections`, `banners`, `blogs`, `coupons`.

### About — 2 endpoints

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| GET    | `/api/admin/about` | Get About page content    |
| PUT    | `/api/admin/about` | Update About page content |

### Contact — 2 endpoints

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| GET    | `/api/admin/contact` | Get contact info    |
| PUT    | `/api/admin/contact` | Update contact info |

### Newsletter — 2 endpoints

| Method | Endpoint                                | Description          |
| ------ | --------------------------------------- | -------------------- |
| GET    | `/api/admin/newsletter/subscribers`     | List all subscribers |
| DELETE | `/api/admin/newsletter/subscribers/:id` | Remove a subscriber  |

### Orders — 4 endpoints

| Method | Endpoint                       | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| GET    | `/api/admin/orders`            | List all orders (platform-wide) |
| GET    | `/api/admin/orders/:id`        | Get order details               |
| PUT    | `/api/admin/orders/:id/status` | Update order status             |
| PUT    | `/api/admin/orders/:id/cancel` | Cancel an order                 |

### Payments — 3 endpoints

| Method | Endpoint                         | Description         |
| ------ | -------------------------------- | ------------------- |
| GET    | `/api/admin/payments`            | List all payments   |
| GET    | `/api/admin/payments/:id`        | Get payment details |
| POST   | `/api/admin/payments/:id/refund` | Issue a refund      |

### Payouts — 4 endpoints

| Method | Endpoint                     | Description                            |
| ------ | ---------------------------- | -------------------------------------- |
| GET    | `/api/admin/payouts`         | List all payouts                       |
| POST   | `/api/admin/payouts`         | Create a payout batch                  |
| PUT    | `/api/admin/payouts/:id`     | Update payout record                   |
| POST   | `/api/admin/payouts/:id/pay` | Mark payout as paid / trigger transfer |

### Reviews — 3 endpoints

| Method | Endpoint                         | Description              |
| ------ | -------------------------------- | ------------------------ |
| GET    | `/api/admin/reviews`             | List all reviews         |
| PUT    | `/api/admin/reviews/:id/approve` | Approve/publish a review |
| DELETE | `/api/admin/reviews/:id`         | Delete a review          |

---

## 🧭 Role Permission Matrix

| Module                                            |  Public   | Customer |  Vendor   |    Admin    |
| ------------------------------------------------- | :-------: | :------: | :-------: | :---------: |
| Auth                                              |    ✅     |    ✅    |    ✅     |     ✅      |
| Products (browse)                                 |    ✅     |    ✅    |    ✅     |     ✅      |
| Products (manage own)                             |    ❌     |    ❌    |    ✅     |     ✅      |
| Products (approve/reject)                         |    ❌     |    ❌    |    ❌     |     ✅      |
| Cart / Wishlist                                   |    ❌     |    ✅    |    ❌     |     ❌      |
| Orders (own)                                      |    ❌     |    ✅    |     —     |      —      |
| Orders (own store)                                |    ❌     |    ❌    |    ✅     |      —      |
| Orders (all)                                      |    ❌     |    ❌    |    ❌     |     ✅      |
| Payments                                          |    ❌     | ✅ (pay) |    ❌     | ✅ (refund) |
| Payouts                                           |    ❌     |    ❌    | ✅ (view) | ✅ (manage) |
| Categories/Brands/Collections/Banner/Blog/Coupons | ✅ (view) |    ❌    |    ❌     |  ✅ (CRUD)  |
| Users management                                  |    ❌     |    ❌    |    ❌     |     ✅      |
| Vendor approval                                   |    ❌     |    ❌    |    ❌     |     ✅      |

---

## 📊 Full API Count Summary

| Role      | API Count |
| --------- | :-------: |
| Public    |    25     |
| Customer  |    35     |
| Vendor    |    16     |
| Admin     |    69     |
| **Total** | **≈145**  |

---

## 🚀 Minimum MVP (Recommended)

If building a **Minimum Viable Product**, ship this reduced scope first, then layer in the rest.

| Role     | Modules Included                                                                                                    | API Count |
| -------- | ------------------------------------------------------------------------------------------------------------------- | :-------: |
| Public   | Auth, Products, Categories, Brands, Banner, Blog                                                                    |    ≈20    |
| Customer | Profile, Address, Cart, Wishlist, Orders, Review, Payment                                                           |    ≈28    |
| Vendor   | Vendor Profile, Products, Orders                                                                                    |    ≈10    |
| Admin    | Dashboard, Users, Vendors, Products, Categories, Brands, Collections, Orders, Coupons, Banner, Blog, About, Contact |    ≈45    |

### 🎯 Minimum Production-Ready Total: **≈100–105 APIs**

This structure is scalable and closely mirrors real-world marketplace backend architecture (Amazon, Flipkart, Meesho, etc.) — you can add modules (Reviews moderation, Payout automation, Analytics) incrementally after MVP launch.

---

## 🏗️ Suggested Tech Stack

| Concern       | Recommendation                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| Auth          | JWT (short-lived access token + long-lived refresh token), bcrypt for password hashing                    |
| Authorization | Role-based access control (RBAC) middleware: `authenticate → authorize(role)`                             |
| File uploads  | multipart/form-data → cloud storage (AWS S3 / Cloudinary) for avatars, product images, banners            |
| Payments      | Stripe (as referenced in the Payment module); webhook endpoint recommended for async payment confirmation |
| Pagination    | `page` / `limit` / `sort` query params on all list endpoints                                              |
| Validation    | Schema validation (Zod / Joi / express-validator) on every POST/PUT body                                  |
| Rate limiting | Per-IP or per-user throttling on Auth and Payment routes especially                                       |
| Docs          | Auto-generate OpenAPI/Swagger spec from route definitions for a live, testable API explorer               |
| Notifications | Email (order confirmation, password reset) + optional SMS/WhatsApp for order status                       |

---
