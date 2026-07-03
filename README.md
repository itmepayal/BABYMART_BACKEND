# Vendor Management API

This module provides a complete Vendor Management system for a multi-vendor e-commerce platform. It includes APIs for vendors, administrators, and public store access.

---

# Base URL

```http
/api/v1
```

---

# Authentication

Most endpoints require authentication.

| Role   | Access                 |
| ------ | ---------------------- |
| Public | No Authentication      |
| Vendor | JWT Token              |
| Admin  | JWT Token + Admin Role |

---

# Vendor APIs

These APIs are accessible only to authenticated vendors.

| Method | Endpoint                     | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| POST   | `/vendors/apply`             | Apply to become a vendor       |
| GET    | `/vendors/me`                | Get current vendor profile     |
| PATCH  | `/vendors/me`                | Update vendor profile          |
| PATCH  | `/vendors/me/store`          | Update store information       |
| PATCH  | `/vendors/me/logo`           | Upload or update store logo    |
| PATCH  | `/vendors/me/banner`         | Upload or update store banner  |
| PATCH  | `/vendors/me/bank`           | Update bank details            |
| GET    | `/vendors/me/dashboard`      | Get vendor dashboard summary   |
| GET    | `/vendors/me/stats`          | Get vendor statistics          |
| GET    | `/vendors/me/orders`         | Get vendor orders              |
| GET    | `/vendors/me/products`       | Get vendor products            |
| GET    | `/vendors/me/reviews`        | Get vendor reviews             |
| GET    | `/vendors/me/wallet`         | Get wallet balance             |
| GET    | `/vendors/me/wallet/history` | Get wallet transaction history |
| POST   | `/vendors/me/payout`         | Request payout                 |
| GET    | `/vendors/me/payouts`        | Get payout history             |

---

# Admin APIs

These APIs are accessible only to administrators.

| Method | Endpoint                        | Description                  |
| ------ | ------------------------------- | ---------------------------- |
| GET    | `/vendors`                      | Get all vendors              |
| GET    | `/vendors/:vendorId`            | Get vendor details           |
| PATCH  | `/vendors/:vendorId/approve`    | Approve vendor               |
| PATCH  | `/vendors/:vendorId/reject`     | Reject vendor                |
| PATCH  | `/vendors/:vendorId/status`     | Activate or suspend vendor   |
| PATCH  | `/vendors/:vendorId/commission` | Update commission rate       |
| PATCH  | `/vendors/:vendorId/bank`       | Update vendor bank details   |
| PATCH  | `/vendors/:vendorId/wallet`     | Update vendor wallet balance |
| GET    | `/vendors/:vendorId/orders`     | Get vendor orders            |
| GET    | `/vendors/:vendorId/products`   | Get vendor products          |
| GET    | `/vendors/:vendorId/payouts`    | Get vendor payout history    |
| DELETE | `/vendors/:vendorId`            | Soft delete vendor           |

---

# Public APIs

These APIs are publicly accessible.

| Method | Endpoint                 | Description        |
| ------ | ------------------------ | ------------------ |
| GET    | `/stores`                | Get all stores     |
| GET    | `/stores/search`         | Search stores      |
| GET    | `/stores/:slug`          | Get store details  |
| GET    | `/stores/:slug/products` | Get store products |
| GET    | `/stores/:slug/reviews`  | Get store reviews  |

---

# Vendor Workflow

```text
Vendor Registration
        │
        ▼
POST /vendors/apply
        │
        ▼
Pending Approval
        │
        ▼
Admin Approves Vendor
        │
        ▼
Vendor Dashboard Access
        │
        ├── Products
        ├── Orders
        ├── Wallet
        ├── Reviews
        ├── Analytics
        └── Store Management
```

---

# Vendor Dashboard Features

- Dashboard Overview
- Store Management
- Product Management
- Order Management
- Wallet Management
- Payout Requests
- Reviews
- Sales Analytics
- Revenue Reports

---

# Admin Features

- Vendor Approval
- Vendor Rejection
- Vendor Suspension
- Commission Management
- Wallet Adjustment
- Vendor Analytics
- Vendor Product Monitoring
- Vendor Order Monitoring

---

# Store Features

Public users can:

- Browse stores
- Search stores
- View store details
- Browse store products
- View store reviews

---

# Response Format

Successful Response

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

Error Response

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

---

# Authorization Matrix

| Endpoint Group        | Public | Vendor | Admin |
| --------------------- | :----: | :----: | :---: |
| Public Stores         |   ✅   |   ✅   |  ✅   |
| Vendor Profile        |   ❌   |   ✅   |  ❌   |
| Vendor Dashboard      |   ❌   |   ✅   |  ❌   |
| Vendor Wallet         |   ❌   |   ✅   |  ❌   |
| Vendor Orders         |   ❌   |   ✅   |  ✅   |
| Vendor Products       |   ❌   |   ✅   |  ✅   |
| Vendor Reviews        |   ❌   |   ✅   |  ✅   |
| Vendor Approval       |   ❌   |   ❌   |  ✅   |
| Commission Management |   ❌   |   ❌   |  ✅   |
| Wallet Adjustment     |   ❌   |   ❌   |  ✅   |
| Vendor Management     |   ❌   |   ❌   |  ✅   |

---

# Future Enhancements

- Vendor KYC Verification
- Store Verification Badge
- Commission Rules
- Automated Payouts
- Tax Reports
- Settlement Reports
- Vendor Notifications
- Performance Analytics
- Inventory Analytics
- Refund Management
- Return Management
- Vendor Coupons
- Vendor Shipping Settings
- Store Followers
- Store Ratings
- Vendor Subscription Plans

---

# API Summary

## Vendor APIs

- POST `/vendors/apply`
- GET `/vendors/me`
- PATCH `/vendors/me`
- PATCH `/vendors/me/store`
- PATCH `/vendors/me/logo`
- PATCH `/vendors/me/banner`
- PATCH `/vendors/me/bank`
- GET `/vendors/me/dashboard`
- GET `/vendors/me/stats`
- GET `/vendors/me/orders`
- GET `/vendors/me/products`
- GET `/vendors/me/reviews`
- GET `/vendors/me/wallet`
- GET `/vendors/me/wallet/history`
- POST `/vendors/me/payout`
- GET `/vendors/me/payouts`

**Total:** 16 APIs

---

## Admin APIs

- GET `/vendors`
- GET `/vendors/:vendorId`
- PATCH `/vendors/:vendorId/approve`
- PATCH `/vendors/:vendorId/reject`
- PATCH `/vendors/:vendorId/status`
- PATCH `/vendors/:vendorId/commission`
- PATCH `/vendors/:vendorId/bank`
- PATCH `/vendors/:vendorId/wallet`
- GET `/vendors/:vendorId/orders`
- GET `/vendors/:vendorId/products`
- GET `/vendors/:vendorId/payouts`
- DELETE `/vendors/:vendorId`

**Total:** 12 APIs

---

## Public APIs

- GET `/stores`
- GET `/stores/search`
- GET `/stores/:slug`
- GET `/stores/:slug/products`
- GET `/stores/:slug/reviews`

**Total:** 5 APIs

---

# Total Endpoints

| Category    |       Count |
| ----------- | ----------: |
| Vendor APIs |          16 |
| Admin APIs  |          12 |
| Public APIs |           5 |
| **Total**   | **33 APIs** |
