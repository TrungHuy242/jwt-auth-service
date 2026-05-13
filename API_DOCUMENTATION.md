# API Documentation

## JWT Authentication Service

> **Base URL:** `http://localhost:5000`
>
> **Content-Type:** `application/json`

---

## Table of Contents

- [Authentication](#authentication)
  - [POST /api/auth/register](#1-post-apiauthregister)
  - [POST /api/auth/login](#2-post-apiauthlogin)
  - [GET /api/auth/me](#3-get-apiauthme)
  - [POST /api/auth/refresh-token](#4-post-apiauthrefresh-token)
  - [POST /api/auth/logout](#5-post-apiauthlogout)
  - [PATCH /api/auth/change-password](#6-patch-apiauthchange-password)
  - [POST /api/auth/forgot-password](#7-post-apiauthforgot-password)
  - [POST /api/auth/reset-password](#8-post-apiauthreset-password)
- [OAuth](#oauth)
  - [GET /api/auth/google](#9-get-apiauthgoogle)
  - [GET /api/auth/google/callback](#10-get-apiauthgooglecallback)
  - [GET /api/auth/google/failure](#11-get-apiauthgooglefailure)
  - [GET /api/auth/facebook](#12-get-apiauthfacebook)
  - [GET /api/auth/facebook/callback](#13-get-apiauthfacebookcallback)
  - [GET /api/auth/facebook/failure](#14-get-apiauthfacebookfailure)
- [Admin](#admin)
  - [GET /api/admin/users](#15-get-apiadminusers)
  - [GET /api/admin/users/:id](#16-get-apiadminusersid)
  - [PATCH /api/admin/users/:id/role](#17-patch-apiadminusersidrole)
  - [PATCH /api/admin/users/:id/status](#18-patch-apiadminusersidstatus)
- [Email Service](#email-service)
  - [POST /api/emails/test](#31-post-apiemailstest)
- [Email Verification](#email-verification)
  - [GET /api/auth/verify-email](#32-get-apiauthverify-email)
  - [POST /api/auth/resend-verification-email](#33-post-apiauthresend-verification-email)
- [User Profile](#user-profile)
  - [GET /api/users/me](#19-get-apiusersme)
  - [PATCH /api/users/me](#20-patch-apiusersme)
  - [PATCH /api/users/me/avatar](#21-patch-apiusersmeavatar)
  - [DELETE /api/users/me/avatar](#22-delete-apiusersmeavatar)
- [Health & Utility](#health--utility)
  - [GET /](#23-get-)
  - [GET /api/health](#24-get-apihealth)
  - [GET /api/test-db](#25-get-apitest-db)
- [Upload File](#upload-file)
  - [POST /api/uploads/single](#26-post-apiuploadssingle)
  - [POST /api/uploads/multiple](#27-post-apiuploadsmultiple)
  - [GET /api/uploads](#28-get-apiuploads)
  - [GET /api/uploads/:id](#29-get-apiuploadsid)
  - [DELETE /api/uploads/:id](#30-delete-apiuploadsid)
- [Notification APIs](#notification-apis)
  - [GET /api/notifications](#34-get-apinotifications)
  - [GET /api/notifications/unread-count](#35-get-apinotificationsunread-count)
  - [PATCH /api/notifications/:id/read](#36-patch-apinotificationsidread)
  - [PATCH /api/notifications/read-all](#37-patch-apinotificationsread-all)
- [Admin Notification APIs](#admin-notification-apis)
  - [POST /api/admin/notifications/user/:id](#38-post-apiadminnotificationsuserid)
  - [POST /api/admin/notifications/broadcast](#39-post-apiadminnotificationsbroadcast)
- [Activity Log APIs](#activity-log-apis)
  - [GET /api/admin/activity-logs](#40-get-apiadminactivity-logs)
  - [GET /api/admin/activity-logs/:id](#41-get-apiadminactivity-logsid)
- [Activity Log Actions](#activity-log-actions)

- [Response Formats](#response-formats)
- [Error Codes](#error-codes)
- [Rate Limiting](#rate-limiting)
- [Data Models](#data-models)

---

## Authentication

### 1. POST `/api/auth/register`

Register a new user account.

**Rate Limit:** 10 requests / 10 minutes per IP

**Request Body:**

| Field    | Type   | Required | Description                     |
|----------|--------|----------|----------------------------------|
| `name`   | string | Yes      | User's display name (min 1 char) |
| `email`  | string | Yes      | Valid email address (unique)     |
| `password`| string| Yes      | Password (min 6 characters)       |

**Example Request:**

```json
{
  "name": "Trung Huy",
  "email": "trunghuy@example.com",
  "password": "securepassword123"
}
```

**Example Response (201 Created):**

```json
{
  "message": "Dang ky tai khoan thanh cong. Vui long kiem tra email de xac thuc tai khoan.",
  "user": {
    "id": 1,
    "name": "Trung Huy",
    "email": "trunghuy@example.com",
    "role": "USER",
    "provider": "local",
    "isVerified": false,
    "createdAt": "2026-05-12T00:00:00.000Z"
  }
}
```

> **Note:** A verification email is sent automatically after registration.

**Error Responses:**

| Status | Message                              |
|--------|--------------------------------------|
| 400    | Vui lÃ²ng nháº­p Ä‘áº§y Ä‘á»§ name, email, password |
| 400    | Email Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng               |
| 429    | Too many requests                     |
| 500    | Lá»—i server khi Ä‘Äƒng kÃ½ tÃ i khoáº£n    |

---

### 2. POST `/api/auth/login`

Authenticate a user with email and password.

**Rate Limit:** 10 requests / 10 minutes per IP

**Request Body:**

| Field      | Type   | Required | Description          |
|------------|--------|----------|----------------------|
| `email`    | string | Yes      | Registered email     |
| `password` | string | Yes      | Account password     |

**Example Request:**

```json
{
  "email": "trunghuy@example.com",
  "password": "securepassword123"
}
```

**Example Response (200 OK):**

```json
{
  "message": "ÄÄƒng nháº­p thÃ nh cÃ´ng",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Trung Huy",
    "email": "trunghuy@example.com",
    "role": "USER",
    "provider": "local",
    "avatar": null,
    "isVerified": false
  }
}
```

**Token Details:**

| Token         | Expiration | Secret Key           |
|---------------|------------|----------------------|
| `accessToken`  | 15 minutes | `JWT_ACCESS_SECRET`  |
| `refreshToken` | 7 days     | `JWT_REFRESH_SECRET` |

**Error Responses:**

| Status | Message                                                       |
|--------|---------------------------------------------------------------|
| 400    | Vui long nhap email va password                              |
| 400    | Email hoac mat khau khong dung                               |
| 403    | Tai khoan chua xac thuc email. Vui long kiem tra email de xac thuc tai khoan. |
| 403    | Tai khoan cua ban da bi khoa. Vui long lien he quan tri vien. |
| 400    | Tai khoan nay dang nhap bang Google/Facebook                 |
| 429    | Too many requests                                            |
| 500    | Lá»—i server khi dang nhap                                   |

---

### 3. GET `/api/auth/me`

Get the currently authenticated user's profile.

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Example Response (200 OK):**

```json
{
  "message": " Láº¥y thÃ´ng tin ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng",
  "user": {
    "id": 1,
    "name": "Trung Huy",
    "email": "trunghuy@example.com",
    "role": "USER",
    "provider": "local",
    "avatar": null,
    "isVerified": false,
    "createdAt": "2026-05-12T00:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message                                    |
|--------|--------------------------------------------|
| 401    | No token provided / Token expired / Invalid token |
| 500    | Lá»—i server khi láº¥y thÃ´ng tin ngÆ°á»i dÃ¹ng   |

---

### 4. POST `/api/auth/refresh-token`

Get a new access token using a valid refresh token.

**Request Body:**

| Field           | Type   | Required | Description           |
|-----------------|--------|----------|-----------------------|
| `refreshToken`  | string | Yes      | Valid refresh token   |

**Example Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example Response (200 OK):**

```json
{
  "message": "Cáº¥p access token má»›i thÃ nh cÃ´ng",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

| Status | Message                       |
|--------|-------------------------------|
| 400    | Vui lÃ²ng gá»­i refresh token   |
| 401    | Refresh token khÃ´ng há»£p lá»‡   |
| 401    | Refresh token Ä‘Ã£ bá»‹ thu há»“i |
| 401    | Refresh token Ä‘Ã£ háº¿t háº¡n    |
| 500    | Lá»—i server khi refresh token |

---

### 5. POST `/api/auth/logout`

Logout and revoke the refresh token.

**Request Body:**

| Field           | Type   | Required | Description           |
|-----------------|--------|----------|-----------------------|
| `refreshToken`  | string | Yes      | Token to revoke       |

**Example Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example Response (200 OK):**

```json
{
  "message": "ÄÄƒng xuáº¥t thÃ nh cÃ´ng"
}
```

**Error Responses:**

| Status | Message                              |
|--------|--------------------------------------|
| 400    | Vui lÃ²ng gá»­i refresh token          |
| 404    | Refresh token khÃ´ng tá»“n táº¡i          |
| 500    | Lá»—i server khi Ä‘Äƒng xuáº¥t            |

---

### 6. PATCH `/api/auth/change-password`

Change the authenticated user's password.

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Request Body:**

| Field         | Type   | Required | Description                |
|---------------|--------|----------|----------------------------|
| `oldPassword` | string | Yes      | Current password           |
| `newPassword` | string | Yes      | New password (min 6 chars) |

**Example Request:**

```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Example Response (200 OK):**

```json
{
  "message": "Äá»•i máº­t kháº©u thÃ nh cÃ´ng. vui lÃ²ng Ä‘Äƒng nháº­p láº¡i."
}
```

**Error Responses:**

| Status | Message                                                   |
|--------|-----------------------------------------------------------|
| 400    | Vui lÃ²ng nháº­p máº­t kháº©u cÅ© vÃ  máº­t kháº©u má»›i              |
| 400    | Máº­t kháº©u má»›i pháº£i cÃ³ Ã­t nháº¥t 6 kÃ½ tá»±                   |
| 400    | Máº­t kháº©u má»›i khÃ´ng Ä‘Æ°á»£c trÃ¹ng vá»›i máº­t kháº©u cÅ©          |
| 400    | TÃ i khoáº£n Google/Facebook khÃ´ng thá»ƒ Ä‘á»•i máº­t kháº©u theo cÃ¡ch nÃ y |
| 404    | NgÆ°á»i dÃ¹ng khÃ´ng tá»“n táº¡i                                 |
| 401    | No token provided                                         |
| 500    | Lá»—i server khi Ä‘á»•i máº­t kháº©u                             |

---

### 7. POST `/api/auth/forgot-password`

Request a password reset token.

**Rate Limit:** 5 requests / 15 minutes per IP

**Request Body:**

| Field  | Type   | Required | Description      |
|--------|--------|----------|------------------|
| `email`| string | Yes      | Registered email |

**Example Request:**

```json
{
  "email": "trunghuy@example.com"
}
```

**Example Response (200 OK):**

```json
{
  "message": "Táº¡o reset token thÃ nh cÃ´ng. Báº£n demo tráº£ token trá»±c tiáº¿p Ä‘á»ƒ test.",
  "resetToken": "a1b2c3d4e5f6...",
  "expiresIn": "15 phÃºt"
}
```

> **Note:** In demo mode, the reset token is returned directly. In production, the token should be sent via email.

**Error Responses:**

| Status | Message                                                              |
|--------|----------------------------------------------------------------------|
| 400    | Vui lÃ²ng nháº­p email                                                 |
| 400    | TÃ i khoáº£n nÃ y Ä‘Äƒng nháº­p báº±ng Google/Facebook, khÃ´ng thá»ƒ reset máº­t kháº©u theo cÃ¡ch nÃ y |
| 429    | Too many requests                                                    |
| 500    | Lá»—i server khi yÃªu cáº§u quÃªn máº­t kháº©u                               |

---

### 8. POST `/api/auth/reset-password`

Reset password using a valid reset token.

**Rate Limit:** 5 requests / 15 minutes per IP

**Request Body:**

| Field         | Type   | Required | Description                    |
|---------------|--------|----------|--------------------------------|
| `resetToken`  | string | Yes      | Token from forgot-password     |
| `newPassword` | string | Yes      | New password (min 6 chars)    |

**Example Request:**

```json
{
  "resetToken": "a1b2c3d4e5f6...",
  "newPassword": "newresetpassword123"
}
```

**Example Response (200 OK):**

```json
{
  "message": "Äáº·t láº¡i máº­t kháº©u thÃ nh cÃ´ng. Vui lÃ²ng Ä‘Äƒng nháº­p láº¡i."
}
```

> **Note:** All existing refresh tokens for this user are revoked upon password reset.

**Error Responses:**

| Status | Message                                         |
|--------|-------------------------------------------------|
| 400    | Vui lÃ²ng nháº­p resetToken vÃ  newPassword        |
| 400    | Máº­t kháº©u má»›i pháº£i cÃ³ Ã­t nháº¥t 6 kÃ½ tá»±          |
| 400    | Reset token khÃ´ng há»£p lá»‡ hoáº·c Ä‘Ã£ háº¿t háº¡n      |
| 429    | Too many requests                               |
| 500    | Lá»—i server khi Ä‘áº·t láº¡i máº­t kháº©u              |

---

## OAuth

### 9. GET `/api/auth/google`

Initiate Google OAuth 2.0 authentication flow.

**Redirects** the user to Google's consent screen.

**Scopes requested:**
- `profile`
- `email`

---

### 10. GET `/api/auth/google/callback`

Google OAuth callback handler. Called automatically by Google after user consent.

**Success Response (200 OK):**

```json
{
  "message": "ÄÄƒng nháº­p Google thÃ nh cÃ´ng",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "Trung Huy",
    "email": "trunghuy@gmail.com",
    "role": "USER",
    "provider": "google",
    "avatar": "https://lh3.googleusercontent.com/...",
    "isVerified": true
  }
}
```

**Error Response:**

```json
{
  "message": "ÄÄƒng nháº­p Google tháº¥t báº¡i"
}
```

---

### 11. GET `/api/auth/google/failure`

Redirect URL when Google OAuth authentication fails.

**Response (401 Unauthorized):**

```json
{
  "message": "ÄÄƒng nháº­p Google tháº¥t báº¡i"
}
```

---

### 12. GET `/api/auth/facebook`

Initiate Facebook OAuth authentication flow.

**Redirects** the user to Facebook's consent screen.

**Scopes requested:**
- `email`

---

### 13. GET `/api/auth/facebook/callback`

Facebook OAuth callback handler.

**Success Response (200 OK):**

```json
{
  "message": "ÄÄƒng nháº­p Facebook thÃ nh cÃ´ng",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "name": "Trung Huy",
    "email": "trunghuy@facebook.com",
    "role": "USER",
    "provider": "facebook",
    "avatar": "https://platform-lookaside.fbsbx.com/...",
    "isVerified": true
  }
}
```

---

### 14. GET `/api/auth/facebook/failure`

Redirect URL when Facebook OAuth authentication fails.

**Response (401 Unauthorized):**

```json
{
  "message": "ÄÄƒng nháº­p Facebook tháº¥t báº¡i"
}
```

---

## Admin

### 15. GET `/api/admin/users`

Get all registered users with pagination, search, and filters (admin only).

**Authentication:** Required (Bearer Token with `ADMIN` role)

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Query Parameters:**

| Parameter | Type   | Default | Description                                      |
|-----------|--------|---------|--------------------------------------------------|
| `page`    | number | 1       | Page number (min: 1)                             |
| `limit`   | number | 10      | Items per page (min: 1)                          |
| `search`  | string | ""      | Search by name, email, or phone                  |
| `role`    | string | -       | Filter by role: `USER` or `ADMIN`               |
| `status`  | string | -       | Filter by status: `ACTIVE` or `BLOCKED`         |
| `provider`| string | -       | Filter by provider: `local`, `google`, `facebook`|

**Example Request:**

```
GET /api/admin/users?page=1&limit=10&search=ngan&role=USER&status=ACTIVE&provider=local
```

**Example Response (200 OK):**

```json
{
  "message": "Láº¥y danh sÃ¡ch ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng",
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalUsers": 3,
    "totalPages": 1
  },
  "filters": {
    "search": "",
    "role": null,
    "status": null,
    "provider": null
  },
  "users": [
    {
      "id": 1,
      "name": "Kim Ngan",
      "email": "ngan@gmail.com",
      "role": "USER",
      "provider": "local",
      "avatar": null,
      "phone": null,
      "address": null,
      "status": "ACTIVE",
      "isVerified": false,
      "lastLoginAt": "2026-01-01T00:00:00.000Z",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**

| Status | Message                                      |
|--------|----------------------------------------------|
| 400    | Page khÃ´ng há»£p lá»‡ / Limit khÃ´ng há»£p lá»‡     |
| 400    | Role khÃ´ng há»£p lá»‡                            |
| 400    | Status khÃ´ng há»£p lá»‡                         |
| 400    | Provider khÃ´ng há»£p lá»‡                        |
| 401    | No token provided / Token expired / Invalid  |
| 403    | Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p chá»©c nÄƒng nÃ y   |
| 500    | Lá»—i server khi láº¥y danh sÃ¡ch ngÆ°á»i dÃ¹ng     |

---

### 16. GET `/api/admin/users/:id`

Get detailed information of a specific user (admin only).

**Authentication:** Required (Bearer Token with `ADMIN` role)

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Example Response (200 OK):**

```json
{
  "message": "Láº¥y thÃ´ng tin ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng",
  "user": {
    "id": 1,
    "name": "Kim Ngan",
    "email": "ngan@gmail.com",
    "role": "USER",
    "provider": "local",
    "avatar": null,
    "phone": null,
    "address": null,
    "status": "ACTIVE",
    "isVerified": false,
    "lastLoginAt": "2026-01-01T00:00:00.000Z",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message                                      |
|--------|----------------------------------------------|
| 401    | No token provided / Token expired / Invalid  |
| 403    | Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p chá»©c nÄƒng nÃ y   |
| 404    | NgÆ°á»i dÃ¹ng khÃ´ng tá»“n táº¡i                     |
| 500    | Lá»—i server khi láº¥y thÃ´ng tin ngÆ°á»i dÃ¹ng     |

---

### 17. PATCH `/api/admin/users/:id/role`

Change a user's role (admin only).

**Authentication:** Required (Bearer Token with `ADMIN` role)

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**

| Field | Type   | Required | Description                          |
|-------|--------|----------|--------------------------------------|
| `role`| string | Yes      | New role: `USER` or `ADMIN`          |

**Example Request:**

```json
{
  "role": "ADMIN"
}
```

**Example Response (200 OK):**

```json
{
  "message": "Cáº­p nháº­t quyá»n ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng",
  "user": {
    "id": 1,
    "role": "ADMIN"
  }
}
```

**Error Responses:**

| Status | Message                                      |
|--------|----------------------------------------------|
| 400    | Vui lÃ²ng chá»n role lÃ  USER hoáº·c ADMIN       |
| 400    | KhÃ´ng thá»ƒ thay Ä‘á»•i role cá»§a chÃ­nh mÃ¬nh     |
| 401    | No token provided / Token expired / Invalid  |
| 403    | Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p chá»©c nÄƒng nÃ y   |
| 404    | NgÆ°á»i dÃ¹ng khÃ´ng tá»“n táº¡i                     |
| 500    | Lá»—i server khi cáº­p nháº­t role ngÆ°á»i dÃ¹ng    |

---

### 18. PATCH `/api/admin/users/:id/status`

Lock or unlock a user's account (admin only).

**Authentication:** Required (Bearer Token with `ADMIN` role)

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**

| Field   | Type   | Required | Description                              |
|---------|--------|----------|------------------------------------------|
| `status`| string | Yes      | New status: `ACTIVE` or `BLOCKED`       |

**Example Request:**

```json
{
  "status": "BLOCKED"
}
```

**Example Response (200 OK):**

```json
{
  "message": "KhÃ³a tÃ i khoáº£n ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng",
  "user": {
    "id": 1,
    "status": "BLOCKED"
  }
}
```

**Error Responses:**

| Status | Message                                      |
|--------|----------------------------------------------|
| 400    | Vui lÃ²ng chá»n status lÃ  ACTIVE hoáº·c BLOCKED |
| 401    | No token provided / Token expired / Invalid  |
| 403    | Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p chá»©c nÄƒng nÃ y   |
| 404    | NgÆ°á»i dÃ¹ng khÃ´ng tá»“n táº¡i                     |
| 500    | Lá»—i server khi cáº­p nháº­t tráº¡ng thÃ¡i ngÆ°á»i dÃ¹ng |

---

## User Profile

### 19. GET `/api/users/me`

Get the current authenticated user's profile.

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Example Response (200 OK):**

```json
{
  "message": "Láº¥y há»“ sÆ¡ cÃ¡ nhÃ¢n thÃ nh cÃ´ng",
  "user": {
    "id": 1,
    "name": "Kim Ngan",
    "email": "ngan@gmail.com",
    "role": "USER",
    "provider": "local",
    "avatar": null,
    "phone": null,
    "address": null,
    "status": "ACTIVE",
    "isVerified": false,
    "lastLoginAt": "2026-01-01T00:00:00.000Z",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message                                    |
|--------|--------------------------------------------|
| 401    | No token provided / Token expired / Invalid |
| 500    | Lá»—i server khi láº¥y há»“ sÆ¡ cÃ¡ nhÃ¢n          |

---

### 20. PATCH `/api/users/me`

Update the current authenticated user's profile.

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**

| Field    | Type   | Required | Description                         |
|----------|--------|----------|-------------------------------------|
| `name`   | string | No       | Display name (min 1 char)          |
| `phone`  | string | No       | Phone number                        |
| `address`| string | No       | User address                        |

**Example Request:**

```json
{
  "name": "Truong Thi Kim Ngan",
  "phone": "0123456789",
  "address": "Da Nang, Viet Nam"
}
```

**Example Response (200 OK):**

```json
{
  "message": "Cáº­p nháº­t há»“ sÆ¡ cÃ¡ nhÃ¢n thÃ nh cÃ´ng",
  "user": {
    "id": 1,
    "name": "Truong Thi Kim Ngan",
    "phone": "0123456789",
    "address": "Da Nang, Viet Nam"
  }
}
```

**Error Responses:**

| Status | Message                                    |
|--------|--------------------------------------------|
| 400    | TÃªn pháº£i cÃ³ Ã­t nháº¥t 1 kÃ½ tá»±               |
| 401    | No token provided / Token expired / Invalid |
| 500    | Lá»—i server khi cáº­p nháº­t há»“ sÆ¡ cÃ¡ nhÃ¢n    |

---

### 21. PATCH `/api/users/me/avatar`

Upload or update the current user's avatar.

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Form Data:**

| Field   | Type | Required | Description                          |
|---------|------|----------|--------------------------------------|
| `avatar`| file | Yes      | Image file (jpg, png, webp, max 5MB) |

**Example Response (200 OK):**

```json
{
  "message": "Upload avatar thÃ nh cÃ´ng",
  "avatar": "/uploads/avatars/1749651234567-12345678.png"
}
```

**Error Responses:**

| Status | Message                                    |
|--------|--------------------------------------------|
| 400    | Vui lÃ²ng chá»n file avatar                 |
| 400    | File avatar pháº£i lÃ  jpg, png hoáº·c webp    |
| 400    | KÃ­ch thÆ°á»›c file avatar khÃ´ng Ä‘Æ°á»£c vÆ°á»£t quÃ¡ 5MB |
| 401    | No token provided / Token expired / Invalid |
| 500    | Lá»—i server khi upload avatar              |

---

### 22. DELETE `/api/users/me/avatar`

Delete the current user's avatar.

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Example Response (200 OK):**

```json
{
  "message": "XÃ³a avatar thÃ nh cÃ´ng"
}
```

**Error Responses:**

| Status | Message                                    |
|--------|--------------------------------------------|
| 400    | NgÆ°á»i dÃ¹ng khÃ´ng cÃ³ avatar Ä‘á»ƒ xÃ³a        |
| 401    | No token provided / Token expired / Invalid |
| 500    | Lá»—i server khi xÃ³a avatar                 |

---

## Health & Utility

### 23. GET `/`

Health check endpoint for the root path.

**Example Response (200 OK):**

```json
{
  "message": "JWT Auth Service is running"
}
```

---

### 24. GET `/api/health`

Full service health check including database connectivity.

**Example Response (200 OK):**

```json
{
  "status": "success",
  "message": "JWT Auth Service is healthy",
  "database": "connected",
  "timestamp": "2026-05-12T13:30:00.000Z"
}
```

**Example Response (500 Error):**

```json
{
  "status": "error",
  "message": "JWT Auth Service is not healthy",
  "database": "disconnected",
  "error": "Connection refused",
  "timestamp": "2026-05-12T13:30:00.000Z"
}
```

---

### 25. GET `/api/test-db`

Test database connection and return all users (for debugging).

**Example Response (200 OK):**

```json
{
  "message": "Database connected successfully",
  "users": [
    {
      "id": 1,
      "name": "Trung Huy",
      "email": "trunghuy@example.com",
      "role": "USER"
    }
  ]
}
```

**Example Response (500 Error):**

```json
{
  "message": "Database connection failed",
  "error": "Connection refused"
}
```

---

## Upload File

### 26. POST `/api/uploads/single`

Upload a single file.

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Form Data:**

| Field   | Type | Required | Description                                      |
|---------|------|----------|--------------------------------------------------|
| `file`  | file | Yes      | File to upload (max 50MB)                        |
| `folder`| string | No     | Folder name (default: `general`)               |

**Example Request:**

```
POST /api/uploads/single
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

file: <binary file data>
folder: products
```

**Example Response (201 Created):**

```json
{
  "message": "Upload file thÃ nh cÃ´ng",
  "file": {
    "id": 1,
    "originalName": "demo.png",
    "fileName": "demo-17123456789.png",
    "filePath": "uploads/products/demo-17123456789.png",
    "fileUrl": "http://localhost:5000/uploads/products/demo-17123456789.png",
    "mimeType": "image/png",
    "size": 12345,
    "folder": "products",
    "type": "IMAGE",
    "uploadedById": 1,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Message                                   |
|--------|-------------------------------------------|
| 400    | Vui lÃ²ng chá»n file Ä‘á»ƒ upload             |
| 401    | No token provided / Token expired / Invalid |
| 500    | Lá»—i server khi upload file               |

---

### 27. POST `/api/uploads/multiple`

Upload multiple files at once.

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Form Data:**

| Field   | Type   | Required | Description                                      |
|---------|--------|----------|--------------------------------------------------|
| `files` | file[] | Yes      | Files to upload (array, max 50MB each)           |
| `folder`| string | No       | Folder name (default: `general`)                 |

**Example Request:**

```
POST /api/uploads/multiple
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

files: <binary file 1>
files: <binary file 2>
files: <binary file 3>
folder: products
```

**Example Response (201 Created):**

```json
{
  "message": "Upload nhiá»u file thÃ nh cÃ´ng",
  "total": 3,
  "files": [
    {
      "id": 2,
      "originalName": "image1.png",
      "fileName": "image1-17123456789.png",
      "filePath": "uploads/products/image1-17123456789.png",
      "fileUrl": "http://localhost:5000/uploads/products/image1-17123456789.png",
      "mimeType": "image/png",
      "size": 12345,
      "folder": "products",
      "type": "IMAGE",
      "uploadedById": 1,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**

| Status | Message                                        |
|--------|------------------------------------------------|
| 400    | Vui lÃ²ng chá»n Ã­t nháº¥t má»™t file Ä‘á»ƒ upload      |
| 401    | No token provided / Token expired / Invalid    |
| 500    | Lá»—i server khi upload nhiá»u file              |

---

### 28. GET `/api/uploads`

Get a paginated list of uploaded files.

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Query Parameters:**

| Parameter | Type   | Default | Description                                       |
|-----------|--------|---------|---------------------------------------------------|
| `page`    | number | 1       | Page number (min: 1)                              |
| `limit`   | number | 10      | Items per page (min: 1)                          |
| `search`  | string | ""      | Search by originalName or fileName               |
| `folder`  | string | -       | Filter by folder name                            |
| `type`    | string | -       | Filter by type: `IMAGE`, `DOCUMENT`, `VIDEO`, `AUDIO`, `OTHER` |

**Example Request:**

```
GET /api/uploads?page=1&limit=10&search=demo&folder=products&type=IMAGE
Authorization: Bearer <accessToken>
```

**Example Response (200 OK):**

```json
{
  "message": "Láº¥y danh sÃ¡ch file thÃ nh cÃ´ng",
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalFiles": 1,
    "totalPages": 1
  },
  "filters": {
    "search": "demo",
    "folder": "products",
    "type": "IMAGE"
  },
  "files": [
    {
      "id": 1,
      "originalName": "demo.png",
      "fileName": "demo-17123456789.png",
      "filePath": "uploads/products/demo-17123456789.png",
      "fileUrl": "http://localhost:5000/uploads/products/demo-17123456789.png",
      "mimeType": "image/png",
      "size": 12345,
      "folder": "products",
      "type": "IMAGE",
      "uploadedById": 1,
      "uploadedBy": {
        "id": 1,
        "name": "Kim Ngan",
        "email": "ngan@gmail.com",
        "role": "USER"
      }
    }
  ]
}
```

**Notes:**

```
USER thÆ°á»ng chá»‰ xem file do chÃ­nh mÃ¬nh upload.
ADMIN xem Ä‘Æ°á»£c toÃ n bá»™ file.
```

**Error Responses:**

| Status | Message                                    |
|--------|--------------------------------------------|
| 400    | Page khÃ´ng há»£p lá»‡ / Limit khÃ´ng há»£p lá»‡  |
| 400    | Type khÃ´ng há»£p lá»‡                         |
| 401    | No token provided / Token expired / Invalid |
| 500    | Lá»—i server khi láº¥y danh sÃ¡ch file        |

---

### 29. GET `/api/uploads/:id`

Get details of a specific uploaded file by ID.

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Example Response (200 OK):**

```json
{
  "message": "Láº¥y chi tiáº¿t file thÃ nh cÃ´ng",
  "file": {
    "id": 1,
    "originalName": "demo.png",
    "fileName": "demo-17123456789.png",
    "filePath": "uploads/products/demo-17123456789.png",
    "fileUrl": "http://localhost:5000/uploads/products/demo-17123456789.png",
    "mimeType": "image/png",
    "size": 12345,
    "folder": "products",
    "type": "IMAGE",
    "uploadedById": 1,
    "uploadedBy": {
      "id": 1,
      "name": "Kim Ngan",
      "email": "ngan@gmail.com",
      "role": "USER"
    }
  }
}
```

**Notes:**

```
USER thÆ°á»ng chá»‰ xem file do chÃ­nh mÃ¬nh upload.
ADMIN xem Ä‘Æ°á»£c má»i file.
```

**Error Responses:**

| Status | Message                                   |
|--------|-------------------------------------------|
| 400    | ID file khÃ´ng há»£p lá»‡                    |
| 401    | No token provided / Token expired / Invalid |
| 403    | Báº¡n khÃ´ng cÃ³ quyá»n xem file nÃ y         |
| 404    | KhÃ´ng tÃ¬m tháº¥y file                      |
| 500    | Lá»—i server khi láº¥y chi tiáº¿t file        |

---

### 30. DELETE `/api/uploads/:id`

Delete an uploaded file by ID.

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Example Response (200 OK):**

```json
{
  "message": "XÃ³a file thÃ nh cÃ´ng",
  "deletedFile": {
    "id": 1,
    "originalName": "demo.png",
    "fileName": "demo-17123456789.png",
    "fileUrl": "http://localhost:5000/uploads/products/demo-17123456789.png"
  }
}
```

**Notes:**

```
USER thÆ°á»ng chá»‰ xÃ³a file do chÃ­nh mÃ¬nh upload.
ADMIN xÃ³a Ä‘Æ°á»£c má»i file.
```

**Error Responses:**

| Status | Message                                   |
|--------|-------------------------------------------|
| 400    | ID file khÃ´ng há»£p lá»‡                    |
| 401    | No token provided / Token expired / Invalid |
| 403    | Báº¡n khÃ´ng cÃ³ quyá»n xÃ³a file nÃ y         |
| 404    | KhÃ´ng tÃ¬m tháº¥y file                      |
| 500    | Lá»—i server khi xÃ³a file                 |

---

## Email Service APIs

### 31. POST `/api/emails/test`

Send a test email to verify email configuration.

**Authentication:** Required (Bearer Token with `ADMIN` role)

**Headers:**

```
Authorization: Bearer <admin_access_token>
Content-Type: application/json
```

**Request Body:**

| Field | Type   | Required | Description          |
|-------|--------|----------|----------------------|
| `to`  | string | Yes      | Recipient email     |

**Example Request:**

```json
{
  "to": "receiver@gmail.com"
}
```

**Example Response (200 OK):**

```json
{
  "message": "Gui email test thanh cong",
  "messageId": "<message_id>"
}
```

> **Note:** Only ADMIN role can send test emails.

**Error Responses:**

| Status | Message                                   |
|--------|-------------------------------------------|
| 400    | Vui long nhap email nguoi nhan         |
| 401    | No token provided / Token expired / Invalid |
| 403    | Ban khong co quyen gui email test        |
| 500    | Lá»—i server khi gui email               |

---

## Email Verification APIs

### 32. GET `/api/auth/verify-email`

Verify user's email address using the token sent to their email.

**Query Parameters:**

| Parameter | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| `token`   | string | Yes      | Verification token from email  |

**Example Request:**

```
GET /api/auth/verify-email?token=abc123def456
```

**Example Response (200 OK):**

```json
{
  "message": "Xac thuc email thanh cong. Ban co the dang nhap."
}
```

**Error Responses:**

| Status | Message                                   |
|--------|-------------------------------------------|
| 400    | Thieu token xac thuc email               |
| 400    | Token xac thuc khong hop le hoac da het han |
| 500    | Lá»—i server khi xac thuc email          |

---

### 33. POST `/api/auth/resend-verification-email`

Resend verification email to user's email address.

**Request Body:**

| Field  | Type   | Required | Description          |
|--------|--------|----------|----------------------|
| `email`| string | Yes      | User's email        |

**Example Request:**

```json
{
  "email": "user@gmail.com"
}
```

**Example Response (200 OK):**

```json
{
  "message": "Neu email ton tai va chua xac thuc, he thong se gui lai email xac thuc"
}
```

> **Note:** For security, the response is the same regardless of whether the email exists.

**Error Responses:**

| Status | Message                                                      |
|--------|--------------------------------------------------------------|
| 400    | Vui long nhap email                                          |
| 400    | Tai khoan nay dang nhap bang Google/Facebook, khong can xac thuc email theo cach nay |
| 400    | Tai khoan nay da duoc xac thuc email                          |
| 403    | Tai khoan cua ban da bi khoa                                 |
| 500    | Lá»—i server khi gui lai email xac thuc                       |

---

## Reset Password Email Flow

### Forgot Password

**Request Body:**

| Field  | Type   | Required | Description      |
|--------|--------|----------|------------------|
| `email`| string | Yes      | Registered email |

**Example Response (200 OK):**

```json
{
  "message": "Neu email ton tai, he thong se gui huong dan dat lai mat khau"
}
```

> **Note:** The system sends a password reset link via email. The reset token is NOT returned directly in production mode.

---

### Reset Password

**Request Body:**

| Field         | Type   | Required | Description                    |
|---------------|--------|----------|--------------------------------|
| `resetToken`  | string | Yes      | Token from email link          |
| `newPassword` | string | Yes      | New password (min 6 chars)   |

**Example Response (200 OK):**

```json
{
  "message": "Dat lai mat khau thanh cong. Vui long dang nhap lai."
}
```

> **Note:** After successful password reset, the system sends a security alert email to notify the user.

---

## Notification APIs

### 34. GET `/api/notifications`

Get the current user's notifications with pagination and filters.

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Query Parameters:**

| Parameter | Type   | Default | Description                                     |
|-----------|--------|---------|------------------------------------------------|
| `page`    | number | 1       | Page number (min: 1)                           |
| `limit`   | number | 10      | Items per page (min: 1)                       |
| `isRead`  | string | -       | Filter: `true` or `false`                    |
| `type`    | string | -       | Filter by type: `SYSTEM`, `SECURITY`, `ACCOUNT`, `ORDER`, `APPOINTMENT`, `COURSE`, `OTHER` |

**Example Request:**

```
GET /api/notifications?page=1&limit=10&isRead=false&type=SYSTEM
```

**Example Response (200 OK):**

```json
{
  "message": "Láº¥y danh sÃ¡ch thÃ´ng bÃ¡o thÃ nh cÃ´ng",
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalNotifications": 5,
    "totalPages": 1
  },
  "filters": {
    "isRead": "false",
    "type": "SYSTEM"
  },
  "notifications": [
    {
      "id": 1,
      "userId": 1,
      "title": "ThÃ´ng bÃ¡o há»‡ thá»‘ng",
      "message": "Há»‡ thá»‘ng sáº½ báº£o trÃ¬ vÃ o 22:00 tá»‘i nay.",
      "type": "SYSTEM",
      "isRead": false,
      "link": "/notifications",
      "createdAt": "2026-05-13T00:00:00.000Z"
    }
  ]
}
```

> **Note:** User chá»‰ xem Ä‘Æ°á»£c thÃ´ng bÃ¡o cá»§a chÃ­nh mÃ¬nh.

**Error Responses:**

| Status | Message                                        |
|--------|------------------------------------------------|
| 400    | Page khÃ´ng há»£p lá»‡ / Limit khÃ´ng há»£p lá»‡      |
| 400    | isRead chá»‰ nháº­n giÃ¡ trá»‹ true hoáº·c false      |
| 400    | Type thÃ´ng bÃ¡o khÃ´ng há»£p lá»‡                    |
| 401    | No token provided / Token expired / Invalid     |
| 500    | Lá»—i server khi láº¥y danh sÃ¡ch thÃ´ng bÃ¡o       |

---

### 35. GET `/api/notifications/unread-count`

Get the count of unread notifications for the current user.

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Example Response (200 OK):**

```json
{
  "message": "Láº¥y sá»‘ thÃ´ng bÃ¡o chÆ°a Ä‘á»c thÃ nh cÃ´ng",
  "unreadCount": 3
}
```

**Error Responses:**

| Status | Message                                    |
|--------|--------------------------------------------|
| 401    | No token provided / Token expired / Invalid |
| 500    | Lá»—i server khi láº¥y sá»‘ thÃ´ng bÃ¡o chÆ°a Ä‘á»c |

---

### 36. PATCH `/api/notifications/:id/read`

Mark a specific notification as read.

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Example Response (200 OK):**

```json
{
  "message": "ÄÃ¡nh dáº¥u thÃ´ng bÃ¡o Ä‘Ã£ Ä‘á»c thÃ nh cÃ´ng",
  "notification": {
    "id": 1,
    "title": "ThÃ´ng bÃ¡o há»‡ thá»‘ng",
    "isRead": true
  }
}
```

> **Note:** User chá»‰ cáº­p nháº­t Ä‘Æ°á»£c thÃ´ng bÃ¡o cá»§a chÃ­nh mÃ¬nh.

**Error Responses:**

| Status | Message                                        |
|--------|------------------------------------------------|
| 400    | ID thÃ´ng bÃ¡o khÃ´ng há»£p lá»‡                     |
| 401    | No token provided / Token expired / Invalid     |
| 403    | Báº¡n khÃ´ng cÃ³ quyá»n cáº­p nháº­t thÃ´ng bÃ¡o nÃ y    |
| 404    | KhÃ´ng tÃ¬m tháº¥y thÃ´ng bÃ¡o                      |
| 500    | Lá»—i server khi Ä‘Ã¡nh dáº¥u thÃ´ng bÃ¡o Ä‘Ã£ Ä‘á»c     |

---

### 37. PATCH `/api/notifications/read-all`

Mark all unread notifications as read.

**Authentication:** Required (Bearer Token)

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Example Response (200 OK):**

```json
{
  "message": "ÄÃ¡nh dáº¥u táº¥t cáº£ thÃ´ng bÃ¡o Ä‘Ã£ Ä‘á»c thÃ nh cÃ´ng",
  "updatedCount": 3
}
```

> **Note:** Only marks unread notifications as read. If no unread notifications exist, `updatedCount` will be 0.

**Error Responses:**

| Status | Message                                                  |
|--------|----------------------------------------------------------|
| 401    | No token provided / Token expired / Invalid              |
| 500    | Lá»—i server khi Ä‘Ã¡nh dáº¥u táº¥t cáº£ thÃ´ng bÃ¡o Ä‘Ã£ Ä‘á»c       |

---

## Admin Notification APIs

### 38. POST `/api/admin/notifications/user/:id`

Send a notification to a specific user (admin only).

**Authentication:** Required (Bearer Token with `ADMIN` role)

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**

| Field    | Type   | Required | Description                                                                                              |
|----------|--------|----------|----------------------------------------------------------------------------------------------------------|
| `title`  | string | Yes      | Notification title                                                                                       |
| `message`| string | Yes      | Notification message                                                                                      |
| `type`   | string | No       | Type: `SYSTEM`, `SECURITY`, `ACCOUNT`, `ORDER`, `APPOINTMENT`, `COURSE`, `OTHER` (default: `SYSTEM`) |
| `link`   | string | No       | Optional link to navigate to when clicking the notification                                                |

**Example Request:**

```json
{
  "title": "ThÃ´ng bÃ¡o tá»« quáº£n trá»‹ viÃªn",
  "message": "ÄÃ¢y lÃ  thÃ´ng bÃ¡o test gá»­i riÃªng cho báº¡n.",
  "type": "SYSTEM",
  "link": "/profile"
}
```

**Example Response (201 Created):**

```json
{
  "message": "Gá»­i thÃ´ng bÃ¡o cho ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng",
  "user": {
    "id": 2,
    "name": "Test User",
    "email": "test@example.com"
  },
  "notification": {
    "id": 5,
    "userId": 2,
    "title": "ThÃ´ng bÃ¡o tá»« quáº£n trá»‹ viÃªn",
    "message": "ÄÃ¢y lÃ  thÃ´ng bÃ¡o test gá»­i riÃªng cho báº¡n.",
    "type": "SYSTEM",
    "isRead": false,
    "link": "/profile"
  }
}
```

**Error Responses:**

| Status | Message                                                                          |
|--------|----------------------------------------------------------------------------------|
| 400    | Vui lÃ²ng nháº­p title vÃ  message                                                   |
| 400    | Type khÃ´ng há»£p lá»‡. Chá»‰ cháº¥p nháº­n SYSTEM, SECURITY, ACCOUNT, ORDER, APPOINTMENT, COURSE hoáº·c OTHER |
| 400    | ID ngÆ°á»i dÃ¹ng khÃ´ng há»£p lá»‡                                                     |
| 401    | No token provided / Token expired / Invalid                                       |
| 403    | Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p chá»©c nÄƒng nÃ y                                        |
| 404    | KhÃ´ng tÃ¬m tháº¥y ngÆ°á»i dÃ¹ng                                                       |
| 500    | Lá»—i server khi gá»­i thÃ´ng bÃ¡o cho ngÆ°á»i dÃ¹ng                                     |

---

### 39. POST `/api/admin/notifications/broadcast`

Send a notification to all active users or filter by role (admin only).

**Authentication:** Required (Bearer Token with `ADMIN` role)

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**

| Field    | Type   | Required | Description                                                                                              |
|----------|--------|----------|----------------------------------------------------------------------------------------------------------|
| `title`  | string | Yes      | Notification title                                                                                       |
| `message`| string | Yes      | Notification message                                                                                      |
| `type`   | string | No       | Type: `SYSTEM`, `SECURITY`, `ACCOUNT`, `ORDER`, `APPOINTMENT`, `COURSE`, `OTHER` (default: `SYSTEM`) |
| `link`   | string | No       | Optional link                                                                                            |
| `role`   | string | No       | Filter by role: `USER` or `ADMIN`                                                                      |

**Example Request (all ACTIVE users):**

```json
{
  "title": "ThÃ´ng bÃ¡o há»‡ thá»‘ng",
  "message": "Há»‡ thá»‘ng sáº½ báº£o trÃ¬ vÃ o 22:00 tá»‘i nay.",
  "type": "SYSTEM",
  "link": "/notifications"
}
```

**Example Response (201 Created):**

```json
{
  "message": "Gá»­i thÃ´ng bÃ¡o hÃ ng loáº¡t thÃ nh cÃ´ng",
  "totalUsers": 5,
  "createdCount": 5,
  "filters": {
    "role": null,
    "status": "ACTIVE"
  }
}
```

**Example Request (filter by role USER):**

```json
{
  "title": "ThÃ´ng bÃ¡o cho ngÆ°á»i dÃ¹ng",
  "message": "ÄÃ¢y lÃ  thÃ´ng bÃ¡o chá»‰ gá»­i cho role USER.",
  "type": "SYSTEM",
  "role": "USER",
  "link": "/notifications"
}
```

> **Note:** Broadcast chá»‰ gá»­i cho user ACTIVE. Náº¿u truyá»n role, há»‡ thá»‘ng chá»‰ gá»­i cho user ACTIVE thuá»™c role Ä‘Ã³.

**Error Responses:**

| Status | Message                                                                          |
|--------|----------------------------------------------------------------------------------|
| 400    | Vui lÃ²ng nháº­p title vÃ  message                                                   |
| 400    | Type khÃ´ng há»£p lá»‡. Chá»‰ cháº¥p nháº­n SYSTEM, SECURITY, ACCOUNT, ORDER, APPOINTMENT, COURSE hoáº·c OTHER |
| 400    | Role khÃ´ng há»£p lá»‡. Chá»‰ cháº¥p nháº­n USER hoáº·c ADMIN                                 |
| 401    | No token provided / Token expired / Invalid                                       |
| 403    | Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p chá»©c nÄƒng nÃ y                                        |
| 404    | KhÃ´ng cÃ³ ngÆ°á»i dÃ¹ng phÃ¹ há»£p Ä‘á»ƒ gá»­i thÃ´ng bÃ¡o                                   |
| 500    | Lá»—i server khi gá»­i thÃ´ng bÃ¡o hÃ ng loáº¡t                                         |

---

## Activity Log APIs

### 40. GET /api/admin/activity-logs

Get all activity logs with pagination, search, and filters (admin only).

**Authentication:** Required (Bearer Token with ADMIN role)

**Headers:**

`
Authorization: Bearer <accessToken>
`

**Query Parameters:**

| Parameter | Type   | Default | Description                                      |
|-----------|--------|---------|--------------------------------------------------|
| page    | number | 1       | Page number (min: 1)                             |
| limit   | number | 10      | Items per page (min: 1)                          |
| search  | string | ""      | Search by action, details, or path               |
| userId  | number | -       | Filter by user ID                                |
| ction  | string | -       | Filter by action type (e.g. LOGIN, CHANGE_PASSWORD) |
| method  | string | -       | Filter by HTTP method: GET, POST, PATCH, PUT, DELETE |

**Example Request:**

`
GET /api/admin/activity-logs?page=1&limit=10&search=LOGIN&userId=1&action=LOGIN&method=POST
`

**Note:**

`
Chi ADMIN moi duoc xem activity log.
Co the tim kiem theo action, details, path.
Co the loc theo userId, action, method.
`

---

### 41. GET /api/admin/activity-logs/:id

Get details of a specific activity log by ID (admin only).

**Authentication:** Required (Bearer Token with ADMIN role)

**Headers:**

`
Authorization: Bearer <accessToken>
`

**Example Response (200 OK):**

`json
{
  "message": "Lay chi tiet activity log thanh cong",
  "log": {
    "id": 1,
    "userId": 1,
    "action": "LOGIN",
    "method": "POST",
    "path": "/api/auth/login",
    "ip": "::1",
    "userAgent": "PostmanRuntime/...",
    "details": "User logged in successfully",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "user": {
      "id": 1,
      "name": "Kim Ngan",
      "email": "ngan@gmail.com",
      "role": "ADMIN",
      "provider": "local",
      "status": "ACTIVE"
    }
  }
}
`

**Error Responses:**

| Status | Message                                      |
|--------|----------------------------------------------|
| 400    | ID activity log khong hop le                  |
| 401    | No token provided / Token expired / Invalid  |
| 403    | Ban khong co quyen truy cap chuc nang nay     |
| 404    | Khong tim thay activity log                  |
| 500    | Loi server khi lay chi tiet activity log     |

---

## Activity Log Actions

`	xt
LOGIN
LOGOUT
CHANGE_PASSWORD
RESET_PASSWORD
UPLOAD_FILE
UPLOAD_MULTIPLE_FILES
DELETE_FILE
UPDATE_USER_ROLE
UPDATE_USER_STATUS
SEND_NOTIFICATION_TO_USER
BROADCAST_NOTIFICATION
`

---
## Response Formats

### Success Response

```json
{
  "message": "Success message here",
  "data": { ... }
}
```

### Error Response

```json
{
  "message": "Error message here",
  "error": "Detailed error (optional)"
}
```

### Paginated List Response (Admin)

```json
{
  "message": "Láº¥y danh sÃ¡ch ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng",
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalUsers": 3,
    "totalPages": 1
  },
  "filters": {
    "search": "",
    "role": null,
    "status": null,
    "provider": null
  },
  "users": [ ... ]
}
```

---

## Error Codes

| HTTP Status | Meaning                              |
|-------------|--------------------------------------|
| 200        | OK - Request succeeded               |
| 201        | Created - Resource created            |
| 400        | Bad Request - Invalid input           |
| 401        | Unauthorized - Invalid/missing token  |
| 403        | Forbidden - Insufficient permissions  |
| 404        | Not Found - Resource doesn't exist    |
| 429        | Too Many Requests - Rate limit exceeded |
| 500        | Internal Server Error                |

---

## Rate Limiting

| Endpoint                          | Limit                        | Window     |
|-----------------------------------|------------------------------|------------|
| Global                            | 200 requests                 | 15 minutes |
| `/api/auth/register`              | 10 requests                  | 10 minutes |
| `/api/auth/login`                 | 10 requests                  | 10 minutes |
| `/api/auth/forgot-password`       | 5 requests                   | 15 minutes |
| `/api/auth/reset-password`        | 5 requests                   | 15 minutes |

---

## Data Models

### User

| Field                | Type    | Description                                |
|----------------------|---------|--------------------------------------------|
| `id`                 | int     | Auto-increment primary key                 |
| `name`               | string  | Display name                              |
| `email`              | string  | Unique email address                       |
| `password`           | string? | Hashed password (null for OAuth users)    |
| `role`               | enum    | `USER` or `ADMIN`                          |
| `provider`           | string  | `local`, `google`, or `facebook`           |
| `providerId`         | string? | OAuth provider user ID                     |
| `avatar`             | string?  | Profile avatar URL (local or URL)          |
| `phone`               | string?  | Phone number                              |
| `address`             | string?  | User address                              |
| `status`             | enum     | `ACTIVE` or `BLOCKED`                    |
| `isVerified`         | boolean  | Email verification status                  |
| `lastLoginAt`         | DateTime?| Last login timestamp                      |
| `resetPasswordToken` | string? | Active password reset token               |
| `resetPasswordExpires`| DateTime?| Reset token expiration time              |
| `verifyEmailToken`  | string? | Email verification token                   |
| `verifyEmailExpires` | DateTime?| Email verification token expiration        |
| `createdAt`          | DateTime| Account creation timestamp                 |
| `updatedAt`          | DateTime| Last update timestamp                      |

### RefreshToken

| Field       | Type     | Description                        |
|-------------|----------|------------------------------------|
| `id`        | int      | Auto-increment primary key         |
| `token`     | string   | Unique refresh token               |
| `userId`    | int      | Foreign key to User               |
| `expiresAt` | DateTime | Token expiration (default: 7 days) |
| `revokedAt` | DateTime?| Revocation timestamp (null=active)  |
| `createdAt` | DateTime | Token creation timestamp           |

### UploadedFile

| Field         | Type     | Description                                              |
|---------------|----------|----------------------------------------------------------|
| `id`          | int      | Auto-increment primary key                               |
| `originalName`| string   | Original file name                                       |
| `fileName`    | string   | Generated unique file name                               |
| `filePath`    | string   | Server file path                                         |
| `fileUrl`     | string   | Full URL to access the file                              |
| `mimeType`    | string   | File MIME type                                           |
| `size`        | int      | File size in bytes                                       |
| `folder`      | string   | Storage folder name                                      |
| `type`        | enum     | `IMAGE`, `DOCUMENT`, `VIDEO`, `AUDIO`, `OTHER`         |
| `uploadedById`| int      | Foreign key to User                                      |
| `uploadedBy`  | User     | Related user (included in responses)                      |
| `createdAt`   | DateTime | Upload timestamp                                         |
| `updatedAt`   | DateTime | Last update timestamp                                    |

### Notification

| Field       | Type     | Description                                                   |
|-------------|----------|---------------------------------------------------------------|
| `id`        | int      | Auto-increment primary key                                    |
| `userId`    | int      | Foreign key to User                                           |
| `title`     | string   | Notification title                                            |
| `message`   | string   | Notification message content                                   |
| `type`      | enum     | `SYSTEM`, `SECURITY`, `ACCOUNT`, `ORDER`, `APPOINTMENT`, `COURSE`, `OTHER` |
| `isRead`    | boolean  | Read status (default: false)                                  |
| `link`      | string?  | Optional navigation link                                      |
| `user`      | User     | Related user (included in responses)                           |
| `createdAt` | DateTime | Creation timestamp                                            |

---

## Environment Variables

| Variable              | Description                                    | Default                      |
|-----------------------|------------------------------------------------|------------------------------|
| `PORT`                | Server port                                    | 5000                         |
| `DATABASE_URL`        | MySQL database connection string               | -                            |
| `JWT_ACCESS_SECRET`   | Secret key for access token signing            | -                            |
| `JWT_REFRESH_SECRET`  | Secret key for refresh token signing           | -                            |
| `JWT_ACCESS_EXPIRES_IN` | Access token expiration time              | 15m                          |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration time            | 7d                           |
| `SESSION_SECRET`      | Express session secret                         | `temporary_session_secret`   |
| `CLIENT_URL`          | Frontend URL for OAuth and email callbacks     | -                            |
| `GOOGLE_CLIENT_ID`    | Google OAuth client ID                         | -                            |
| `GOOGLE_CLIENT_SECRET`| Google OAuth client secret                     | -                            |
| `FACEBOOK_APP_ID`     | Facebook OAuth app ID                          | -                            |
| `FACEBOOK_APP_SECRET` | Facebook OAuth app secret                      | -                            |
| `EMAIL_HOST`          | SMTP server host                               | smtp.gmail.com               |
| `EMAIL_PORT`          | SMTP server port                               | 587                          |
| `EMAIL_SECURE`        | Use TLS/SSL                                   | false                        |
| `EMAIL_USER`          | SMTP username (Gmail address)                 | -                            |
| `EMAIL_PASS`          | SMTP password (Gmail App Password)             | -                            |
| `EMAIL_FROM_NAME`     | Email sender name                              | JWT Auth Service              |
| `EMAIL_FROM_ADDRESS`  | Email sender address                           | -                            |

---

## Security Features

- **Password Hashing:** bcrypt with salt rounds of 10
- **JWT Tokens:** HS256 algorithm with separate access/refresh keys
- **Token Storage:** Refresh tokens stored in database with expiration
- **Rate Limiting:** Express Rate Limit middleware
- **CORS:** Configured with allowed origins and methods
- **Helmet:** Security headers via Helmet.js
- **Token Revocation:** Refresh tokens can be revoked on logout
- **Password Reset:** Token-based reset with 15-minute expiration
- **OAuth Support:** Google & Facebook OAuth 2.0
- **Email Verification:** Required for local accounts before login
- **Security Alerts:** Email notifications on password changes and account status changes
- **In-app Notifications:** System notifications for role changes, account lock/unlock, and admin broadcasts

---

## Email Templates

The system includes the following HTML email templates:

| Template                    | Purpose                                    |
|-----------------------------|-------------------------------------------|
| `testEmailTemplate`        | Test email connectivity                   |
| `resetPasswordTemplate`     | Password reset link                       |
| `verifyEmailTemplate`      | Email verification link                   |
| `securityAlertTemplate`     | Password change / account status alerts   |
| `accountStatusTemplate`     | Account lock / unlock notifications        |

All templates use a consistent base layout with JWT Auth Service branding.

---

## Quick Test with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Profile (replace <token>)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <accessToken>"

# Health Check
curl http://localhost:5000/api/health
```
