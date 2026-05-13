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
- [User Profile](#user-profile)
  - [GET /api/users/me](#19-get-apiusersme)
  - [PATCH /api/users/me](#20-patch-apiusersme)
  - [PATCH /api/users/me/avatar](#21-patch-apiusersmeavatar)
  - [DELETE /api/users/me/avatar](#22-delete-apiusersmeavatar)
- [Health & Utility](#health--utility)
  - [GET /](#23-get-)
  - [GET /api/health](#24-get-apihealth)
  - [GET /api/test-db](#25-get-apitest-db)
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
  "message": "Đăng ký tài khoản thành công",
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

**Error Responses:**

| Status | Message                              |
|--------|--------------------------------------|
| 400    | Vui lòng nhập đầy đủ name, email, password |
| 400    | Email đã được sử dụng               |
| 429    | Too many requests                     |
| 500    | Lỗi server khi đăng ký tài khoản    |

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
  "message": "Đăng nhập thành công",
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

| Status | Message                                           |
|--------|---------------------------------------------------|
| 400    | Vui lòng nhập email và password                  |
| 400    | Email hoặc mật khẩu không đúng                  |
| 400    | Tài khoản này đăng nhập bằng Google/Facebook   |
| 429    | Too many requests                                 |
| 500    | Lỗi server khi đăng nhập                        |

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
  "message": " Lấy thông tin người dùng thành công",
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
| 500    | Lỗi server khi lấy thông tin người dùng   |

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
  "message": "Cấp access token mới thành công",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

| Status | Message                       |
|--------|-------------------------------|
| 400    | Vui lòng gửi refresh token   |
| 401    | Refresh token không hợp lệ   |
| 401    | Refresh token đã bị thu hồi |
| 401    | Refresh token đã hết hạn    |
| 500    | Lỗi server khi refresh token |

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
  "message": "Đăng xuất thành công"
}
```

**Error Responses:**

| Status | Message                              |
|--------|--------------------------------------|
| 400    | Vui lòng gửi refresh token          |
| 404    | Refresh token không tồn tại          |
| 500    | Lỗi server khi đăng xuất            |

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
  "message": "Đổi mật khẩu thành công. vui lòng đăng nhập lại."
}
```

**Error Responses:**

| Status | Message                                                   |
|--------|-----------------------------------------------------------|
| 400    | Vui lòng nhập mật khẩu cũ và mật khẩu mới              |
| 400    | Mật khẩu mới phải có ít nhất 6 ký tự                   |
| 400    | Mật khẩu mới không được trùng với mật khẩu cũ          |
| 400    | Tài khoản Google/Facebook không thể đổi mật khẩu theo cách này |
| 404    | Người dùng không tồn tại                                 |
| 401    | No token provided                                         |
| 500    | Lỗi server khi đổi mật khẩu                             |

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
  "message": "Tạo reset token thành công. Bản demo trả token trực tiếp để test.",
  "resetToken": "a1b2c3d4e5f6...",
  "expiresIn": "15 phút"
}
```

> **Note:** In demo mode, the reset token is returned directly. In production, the token should be sent via email.

**Error Responses:**

| Status | Message                                                              |
|--------|----------------------------------------------------------------------|
| 400    | Vui lòng nhập email                                                 |
| 400    | Tài khoản này đăng nhập bằng Google/Facebook, không thể reset mật khẩu theo cách này |
| 429    | Too many requests                                                    |
| 500    | Lỗi server khi yêu cầu quên mật khẩu                               |

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
  "message": "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại."
}
```

> **Note:** All existing refresh tokens for this user are revoked upon password reset.

**Error Responses:**

| Status | Message                                         |
|--------|-------------------------------------------------|
| 400    | Vui lòng nhập resetToken và newPassword        |
| 400    | Mật khẩu mới phải có ít nhất 6 ký tự          |
| 400    | Reset token không hợp lệ hoặc đã hết hạn      |
| 429    | Too many requests                               |
| 500    | Lỗi server khi đặt lại mật khẩu              |

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
  "message": "Đăng nhập Google thành công",
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
  "message": "Đăng nhập Google thất bại"
}
```

---

### 11. GET `/api/auth/google/failure`

Redirect URL when Google OAuth authentication fails.

**Response (401 Unauthorized):**

```json
{
  "message": "Đăng nhập Google thất bại"
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
  "message": "Đăng nhập Facebook thành công",
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
  "message": "Đăng nhập Facebook thất bại"
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
  "message": "Lấy danh sách người dùng thành công",
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
| 400    | Page không hợp lệ / Limit không hợp lệ     |
| 400    | Role không hợp lệ                            |
| 400    | Status không hợp lệ                         |
| 400    | Provider không hợp lệ                        |
| 401    | No token provided / Token expired / Invalid  |
| 403    | Bạn không có quyền truy cập chức năng này   |
| 500    | Lỗi server khi lấy danh sách người dùng     |

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
  "message": "Lấy thông tin người dùng thành công",
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
| 403    | Bạn không có quyền truy cập chức năng này   |
| 404    | Người dùng không tồn tại                     |
| 500    | Lỗi server khi lấy thông tin người dùng     |

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
  "message": "Cập nhật quyền người dùng thành công",
  "user": {
    "id": 1,
    "role": "ADMIN"
  }
}
```

**Error Responses:**

| Status | Message                                      |
|--------|----------------------------------------------|
| 400    | Vui lòng chọn role là USER hoặc ADMIN       |
| 400    | Không thể thay đổi role của chính mình     |
| 401    | No token provided / Token expired / Invalid  |
| 403    | Bạn không có quyền truy cập chức năng này   |
| 404    | Người dùng không tồn tại                     |
| 500    | Lỗi server khi cập nhật role người dùng    |

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
  "message": "Khóa tài khoản người dùng thành công",
  "user": {
    "id": 1,
    "status": "BLOCKED"
  }
}
```

**Error Responses:**

| Status | Message                                      |
|--------|----------------------------------------------|
| 400    | Vui lòng chọn status là ACTIVE hoặc BLOCKED |
| 401    | No token provided / Token expired / Invalid  |
| 403    | Bạn không có quyền truy cập chức năng này   |
| 404    | Người dùng không tồn tại                     |
| 500    | Lỗi server khi cập nhật trạng thái người dùng |

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
  "message": "Lấy hồ sơ cá nhân thành công",
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
| 500    | Lỗi server khi lấy hồ sơ cá nhân          |

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
  "message": "Cập nhật hồ sơ cá nhân thành công",
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
| 400    | Tên phải có ít nhất 1 ký tự               |
| 401    | No token provided / Token expired / Invalid |
| 500    | Lỗi server khi cập nhật hồ sơ cá nhân    |

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
  "message": "Upload avatar thành công",
  "avatar": "/uploads/avatars/1749651234567-12345678.png"
}
```

**Error Responses:**

| Status | Message                                    |
|--------|--------------------------------------------|
| 400    | Vui lòng chọn file avatar                 |
| 400    | File avatar phải là jpg, png hoặc webp    |
| 400    | Kích thước file avatar không được vượt quá 5MB |
| 401    | No token provided / Token expired / Invalid |
| 500    | Lỗi server khi upload avatar              |

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
  "message": "Xóa avatar thành công"
}
```

**Error Responses:**

| Status | Message                                    |
|--------|--------------------------------------------|
| 400    | Người dùng không có avatar để xóa        |
| 401    | No token provided / Token expired / Invalid |
| 500    | Lỗi server khi xóa avatar                 |

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
  "message": "Lấy danh sách người dùng thành công",
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
| `createdAt`          | DateTime| Account creation timestamp                 |
| `updatedAt`          | DateTime| Last update timestamp                      |

### RefreshToken

| Field       | Type     | Description                        |
|-------------|----------|------------------------------------|
| `id`        | int      | Auto-increment primary key         |
| `token`     | string   | Unique refresh token               |
| `userId`    | int      | Foreign key to User                |
| `expiresAt` | DateTime | Token expiration (default: 7 days) |
| `revokedAt` | DateTime?| Revocation timestamp (null=active)  |
| `createdAt` | DateTime | Token creation timestamp           |

---

## Environment Variables

| Variable            | Description                                    | Default                      |
|---------------------|------------------------------------------------|------------------------------|
| `PORT`              | Server port                                    | 5000                         |
| `DATABASE_URL`      | MySQL database connection string               | -                            |
| `JWT_ACCESS_SECRET` | Secret key for access token signing            | -                            |
| `JWT_REFRESH_SECRET`| Secret key for refresh token signing           | -                            |
| `JWT_ACCESS_EXPIRES_IN` | Access token expiration time              | 15m                          |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration time            | 7d                           |
| `SESSION_SECRET`    | Express session secret                         | `temporary_session_secret`   |
| `GOOGLE_CLIENT_ID`  | Google OAuth client ID                         | -                            |
| `GOOGLE_CLIENT_SECRET`| Google OAuth client secret                   | -                            |
| `FACEBOOK_CLIENT_ID` | Facebook OAuth app ID                         | -                            |
| `FACEBOOK_CLIENT_SECRET` | Facebook OAuth app secret                  | -                            |

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
