# JWT Authentication Service

A secure authentication system built with Node.js, Express, Prisma, MySQL, JWT and OAuth.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Docker Deployment](#docker-deployment)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [Health API](#health-api)
  - [Auth API](#auth-api)
  - [Email API](#email-api)
  - [User Profile API](#user-profile-api)
  - [Admin API](#admin-api)
  - [Admin Dashboard API](#admin-dashboard-api)
- [Upload File API](#upload-file-api)
- [Notification API](#notification-api)
- [Admin Notification API](#admin-notification-api)
- [Request Examples](#request-examples)
- [Roles & Permissions](#roles--permissions)
- [Security Notes](#security-notes)
- [OAuth Configuration](#oauth-configuration)
- [Email Configuration](#email-configuration)
- [License](#license)

---

## Features

- User registration and login
- Password hashing with bcrypt
- JWT Access Token generation
- Refresh Token with database persistence
- User authentication middleware
- Role-based access control (USER / ADMIN)
- Get current user profile
- Update current user profile
- Upload avatar
- Delete avatar
- Logout with token revocation
- Change password
- Forgot / Reset password
- Google OAuth 2.0 login
- Facebook OAuth login
- Admin xem chi tiet nguoi dung
- Admin doi role nguoi dung
- Admin khoa / mo khoa tai khoan
- Admin tim kiem, loc, phan trang danh sach nguoi dung
- Upload 1 file dung chung
- Upload nhieu file cung luc
- Luu thong tin file vao database
- Xem danh sach file da upload
- Tim kiem, loc, phan trang danh sach file
- Xem chi tiet file theo ID
- Xoa file da upload
- Phan quyen file: user chi quan ly file cua minh, admin quan ly tat ca
- Middleware phan quyen linh hoat theo role
- Rate limiting (anti-spam)
- Helmet HTTP security headers
- Health check endpoint with database status
- Docker containerization with MySQL
- Gui email test bang Nodemailer
- Gui email dat lai mat khau
- Gui email xac thuc tai khoan
- Gui lai email xac thuc
- Chan dang nhap neu chua xac thuc email
- Gui email thong bao khi doi mat khau
- Gui email thong bao khi reset mat khau
- Gui email thong bao khi tai khoan bi khoa / mo khoa
- Email template HTML dung lai duoc
- Tao thong bao trong he thong
- User xem danh sach thong bao
- Dem so thong bao chua doc
- Danh dau mot thong bao la da doc
- Danh dau tat ca thong bao la da doc
- Admin gui thong bao cho mot user
- Admin gui thong bao hang loat
- Tu dong tao thong bao khi doi role user
- Tu dong tao thong bao khi khoa / mo khoa tai khoan
- Ghi lai lich su hoat dong nguoi dung
- Ghi log dang nhap / dang xuat
- Ghi log doi mat khau / reset mat khau
- Ghi log upload file / xoa file
- Ghi log admin doi role nguoi dung
- Ghi log admin khoa / mo khoa tai khoan
- Ghi log admin gui thong bao cho user
- Ghi log admin gui thong bao hang loat
- Admin xem danh sach activity log
- Admin tim kiem, loc, phan trang activity log
- Admin xem chi tiet activity log
- Admin xem thong ke tong quan he thong
- Admin xem thong ke nguoi dung theo role, provider, status
- Admin xem thong ke user da xac thuc / chua xac thuc email
- Admin xem thong ke file upload theo type va folder
- Admin xem tong dung luong file upload
- Admin xem thong ke notification va activity log
- Admin xem hoat dong gan day cua he thong

---

## Tech Stack

| Category       | Technology          |
|----------------|---------------------|
| Runtime        | Node.js             |
| Framework      | Express.js          |
| ORM            | Prisma              |
| Database       | MySQL               |
| Auth           | JWT + Refresh Tokens|
| Hashing        | bcryptjs            |
| OAuth          | Passport.js         |
| HTTP Security  | Helmet              |
| Rate Limiting  | Express Rate Limit  |
| Email          | Nodemailer          |
| Notification   | In-app Notifications |
| Activity Log   | Admin Audit Trail    |
| Environment    | Dotenv              |
| Container      | Docker + Compose    |

---

## Project Structure

```txt
jwt-auth-service/

-- prisma/
   |-- schema.prisma

-- src/
   |-- config/
   |   |-- prisma.js
   |   |-- passport.js
   |   |-- email.js

   |-- controllers/
   |   |-- auth.controller.js
   |   |-- user.controller.js
   |   |-- admin.controller.js
   |   |-- upload.controller.js
   |   |-- email.controller.js
   |   |-- notification.controller.js
   |   |-- adminNotification.controller.js

   |-- middlewares/
   |   |-- auth.middleware.js
   |   |-- upload.middleware.js
   |   |-- validate.middleware.js
   |   |-- rateLimit.middleware.js

   |-- routes/
   |   |-- auth.routes.js
   |   |-- user.routes.js
   |   |-- admin.routes.js
   |   |-- health.routes.js
   |   |-- upload.routes.js
   |   |-- email.routes.js
   |   |-- notification.routes.js
   |   |-- adminNotification.routes.js

   |-- services/
   |   |-- email.service.js
   |   |-- notification.service.js

   |-- templates/
   |   |-- email.templates.js

   |-- utils/
   |   |-- token.js

   |-- server.js

-- .dockerignore
-- Dockerfile
-- docker-compose.yml
-- .env.example
-- .gitignore
-- uploads/
   |-- avatars/
-- package.json
-- README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MySQL 8.0+
- npm or yarn
- Docker (for Docker deployment)

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd jwt-auth-service
npm install
```

Create a `.env` file based on `.env.example`:

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Then fill in your credentials in `.env`.

### Database Setup

Create the MySQL database:

```sql
CREATE DATABASE jwt_auth_service;
```

Update the `DATABASE_URL` in `.env`:

```env
# Without password
DATABASE_URL="mysql://root@localhost:3306/jwt_auth_service"

# With password
DATABASE_URL="mysql://root:your_password@localhost:3306/jwt_auth_service"
```

Run migrations and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

---

## Docker Deployment

You can run the entire stack (Node.js + MySQL) using Docker Compose.

### Prerequisites

- Docker Engine 20.10+
- Docker Compose v2+

### Quick Start

```bash
# Build and run containers
docker compose up --build

# Run in detached mode (background)
docker compose up -d --build
```

### Running Migrations

```bash
# Apply database migrations
docker exec jwt_auth_service npx prisma migrate deploy
```

### Access the Service

| Service      | URL                                               |
|--------------|---------------------------------------------------|
| Backend API  | http://localhost:5000                             |
| MySQL        | localhost:3306 (inside Docker network)             |

### Docker Commands

```bash
# View logs
docker compose logs -f

# Stop containers
docker compose down

# Rebuild after code changes
docker compose up --build

# Reset database
docker exec jwt_auth_mysql mysql -uroot -proot -e "DROP DATABASE IF EXISTS jwt_auth_service; CREATE DATABASE jwt_auth_service;"
docker exec jwt_auth_service npx prisma migrate deploy
```

### Environment Variables (Docker)

The `docker-compose.yml` passes these environment variables to the container:

| Variable              | Description                    |
|-----------------------|--------------------------------|
| `PORT`                | Server port (default: 5000)    |
| `DATABASE_URL`        | MySQL connection string        |
| `JWT_ACCESS_SECRET`   | Access token secret key        |
| `JWT_REFRESH_SECRET`  | Refresh token secret key       |
| `SESSION_SECRET`      | Session secret key             |
| `GOOGLE_CLIENT_ID`    | Google OAuth client ID         |
| `GOOGLE_CLIENT_SECRET`| Google OAuth client secret     |
| `CLIENT_URL`          | Frontend URL for OAuth callback|

> **Note:** Update secrets in `docker-compose.yml` before deploying to production.

---

## Usage

Start the development server:

```bash
npm run dev
```

Server runs at: **http://localhost:5000**

---

## API Reference

### Health API

| Method | Endpoint        | Description                        |
|--------|-----------------|------------------------------------|
| GET    | `/api/health`   | Health check with database status  |

**Response:**

```json
{
  "status": "success",
  "message": "JWT Auth Service is healthy",
  "database": "connected",
  "timestamp": "2026-05-12T15:45:20.678Z"
}
```

### Auth API

| Method | Endpoint                            | Description                    |
|--------|-------------------------------------|-------------------------------|
| POST   | `/api/auth/register`                 | Register and send verify email |
| POST   | `/api/auth/login`                   | Login                         |
| GET    | `/api/auth/verify-email?token=...` | Verify email                  |
| POST   | `/api/auth/resend-verification-email` | Resend verification email   |
| GET    | `/api/auth/me`                      | Get current user              |
| POST   | `/api/auth/refresh-token`            | Refresh access token          |
| POST   | `/api/auth/logout`                  | Logout                        |
| PATCH  | `/api/auth/change-password`          | Change password + send alert |
| POST   | `/api/auth/forgot-password`          | Send reset password email    |
| POST   | `/api/auth/reset-password`           | Reset password + send alert  |
| GET    | `/api/auth/google`                  | Google login                  |
| GET    | `/api/auth/google/callback`         | Google callback               |
| GET    | `/api/auth/facebook`                | Facebook login                |
| GET    | `/api/auth/facebook/callback`       | Facebook callback             |

### Email API

| Method | Endpoint            | Description                |
|--------|---------------------|----------------------------|
| POST   | `/api/emails/test`  | Admin send test email     |

### User Profile API

| Method | Endpoint               | Description                    |
|--------|------------------------|--------------------------------|
| GET    | `/api/users/me`        | View current user profile      |
| PATCH  | `/api/users/me`        | Update current user profile    |
| PATCH  | `/api/users/me/avatar` | Upload / update avatar        |
| DELETE | `/api/users/me/avatar`| Delete avatar                  |

### Admin API

| Method | Endpoint                     | Description                                      |
|--------|------------------------------|--------------------------------------------------|
| GET    | `/api/admin/users`           | Admin list users with pagination/search/filter  |
| GET    | `/api/admin/users/:id`       | Admin view user details                          |
| PATCH  | `/api/admin/users/:id/role`  | Admin change user role                           |
| PATCH  | `/api/admin/users/:id/status`| Admin lock / unlock account + send email        |

### Upload File API

| Method | Endpoint                 | Description                              |
|--------|--------------------------|------------------------------------------|
| POST   | `/api/uploads/single`    | Upload 1 file                            |
| POST   | `/api/uploads/multiple`   | Upload nhieu file                        |
| GET    | `/api/uploads`           | Lay danh sach file da upload            |
| GET    | `/api/uploads/:id`       | Xem chi tiet file                       |
| DELETE | `/api/uploads/:id`       | Xoa file                                 |

### Notification API

| Method | Endpoint                            | M? t?                                    |
|--------|-------------------------------------|------------------------------------------|
| GET    | `/api/notifications`                | User xem danh s?ch th?ng b?o             |
| GET    | `/api/notifications/unread-count`    | ??m th?ng b?o chua d?c                   |
| PATCH  | `/api/notifications/:id/read`       | ??nh d?u m?t th?ng b?o d? d?c            |
| PATCH  | `/api/notifications/read-all`        | ??nh d?u t?t c? th?ng b?o d? d?c        |

### Admin Notification API

| Method | Endpoint                                   | M? t?                                      |
|--------|--------------------------------------------|------------------------------------------|
| POST   | `/api/admin/notifications/user/:id`        | Admin g?i th?ng b?o cho m?t user          |
| POST   | `/api/admin/notifications/broadcast`       | Admin gui thong bao hang loat            |

---

### Activity Log API

| Method | Endpoint                         | Mo ta                                |
|--------|----------------------------------|--------------------------------------|
| GET    | `/api/admin/activity-logs`        | Admin xem danh sach activity log     |
| GET    | `/api/admin/activity-logs/:id`   | Admin xem chi tiet activity log      |

### Admin Dashboard API

| Method | Endpoint                              | Mo ta                                      |
|--------|---------------------------------------|-------------------------------------------|
| GET    | `/api/admin/dashboard/overview`        | Thong ke tong quan he thong               |
| GET    | `/api/admin/dashboard/users`           | Thong ke nguoi dung                        |
| GET    | `/api/admin/dashboard/files`           | Thong ke file upload                       |
| GET    | `/api/admin/dashboard/system`          | Thong ke notification va activity log     |
| GET    | `/api/admin/dashboard/recent-activities` | Hoat dong gan day                        |

---

## Request Examples
### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Kim Ngan",
  "email": "ngan@gmail.com",
  "password": "123456"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ngan@gmail.com",
  "password": "123456"
}
```

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

### Refresh Token

```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

### Change Password

```http
PATCH /api/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "oldPassword": "123456",
  "newPassword": "123456789"
}
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

### Verify Email

```http
GET /api/auth/verify-email?token=verify_token
```

### Resend Verification Email

```http
POST /api/auth/resend-verification-email
Content-Type: application/json

{
  "email": "user@gmail.com"
}
```

### Forgot Password With Email

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@gmail.com"
}
```

After calling this API, the system will send a password reset link via email.

### Send Test Email

```http
POST /api/emails/test
Authorization: Bearer admin_access_token
Content-Type: application/json

{
  "to": "receiver@gmail.com"
}
```

Response:

```json
{
  "message": "Gui email test thanh cong",
  "messageId": "..."
}
```

### Update Profile

```http
PATCH /api/users/me
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Truong Thi Kim Ngan",
  "phone": "0123456789",
  "address": "Da Nang, Viet Nam"
}
```

### Upload Avatar

```http
PATCH /api/users/me/avatar
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Form-data:
  avatar: <image file jpg/png/webp>
```

### Delete Avatar

```http
DELETE /api/users/me/avatar
Authorization: Bearer <access_token>
```

### Admin Filter Users

```http
GET /api/admin/users?page=1&limit=10&search=ngan&role=USER&status=ACTIVE&provider=local
Authorization: Bearer <admin_access_token>
```

### Upload Single File

```http
POST /api/uploads/single
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Form-data:
  file: <file to upload>
  folder: products
```

### Upload Multiple Files

```http
POST /api/uploads/multiple
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Form-data:
  files: <file 1>
  files: <file 2>
  files: <file 3>
  folder: products
```

### Get Uploaded Files

```http
GET /api/uploads?page=1&limit=10&search=demo&folder=products&type=IMAGE
Authorization: Bearer <access_token>
```

### Get Uploaded File By ID

```http
GET /api/uploads/:id
Authorization: Bearer <access_token>
```

### Delete Uploaded File

```http
DELETE /api/uploads/:id
Authorization: Bearer <access_token>
```

### Get My Notifications

```http
GET /api/notifications?page=1&limit=10&isRead=false&type=SYSTEM
Authorization: Bearer <access_token>
```

### Get Unread Notification Count

```http
GET /api/notifications/unread-count
Authorization: Bearer <access_token>
```

Response:

```json
{
  "message": "L?y s? th?ng b?o chua d?c th?nh c?ng",
  "unreadCount": 3
}
```

### Mark Notification As Read

```http
PATCH /api/notifications/:id/read
Authorization: Bearer <access_token>
```

### Mark All Notifications As Read

```http
PATCH /api/notifications/read-all
Authorization: Bearer <access_token>
```

Response:

```json
{
  "message": "??nh d?u t?t c? th?ng b?o d? d?c th?nh c?ng",
  "updatedCount": 3
}
```

### Admin Send Notification To User

```http
POST /api/admin/notifications/user/:id
Authorization: Bearer <admin_access_token>
Content-Type: application/json

{
  "title": "Th?ng b?o t? qu?n tr? vi?n",
  "message": "??y l? th?ng b?o test g?i ri?ng cho b?n.",
  "type": "SYSTEM",
  "link": "/profile"
}
```

### Admin Broadcast Notification

```http
POST /api/admin/notifications/broadcast
Authorization: Bearer <admin_access_token>
Content-Type: application/json

{
  "title": "Th?ng b?o h? th?ng",
  "message": "H? th?ng s? b?o tr? v?o 22:00 t?i nay.",
  "type": "SYSTEM",
  "link": "/notifications"
}
```

G?i theo role:

```json
{
  "title": "Th?ng b?o cho ngu?i d?ng",
  "message": "??y l? th?ng b?o ch? g?i cho role USER.",
  "type": "SYSTEM",
  "role": "USER",
  "link": "/notifications"
}
```

### Notification Types

```txt
SYSTEM
SECURITY
ACCOUNT
ORDER
APPOINTMENT
COURSE
OTHER

? nghia:

SYSTEM: th?ng b?o h? th?ng
SECURITY: th?ng b?o b?o m?t
ACCOUNT: t?i kho?n, role, kh?a/m? kh?a
ORDER: don h?ng
APPOINTMENT: l?ch h?n
COURSE: kh?a h?c/b?i h?c
OTHER: lo?i kh?c
```

### Get Activity Logs

```http
GET /api/admin/activity-logs?page=1&limit=10&search=LOGIN&userId=1&action=LOGIN&method=POST
Authorization: Bearer admin_access_token
```

Query params:

```txt
page=1
limit=10
search=LOGIN
userId=1
action=LOGIN
method=POST
```

Response:

```json
{
  "message": "Lay danh sach activity log thanh cong",
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalLogs": 20,
    "totalPages": 2
  },
  "filters": {
    "search": "LOGIN",
    "userId": "1",
    "action": "LOGIN",
    "method": "POST"
  },
  "logs": []
}
```

### Get Activity Log By ID

```http
GET /api/admin/activity-logs/:id
Authorization: Bearer admin_access_token
```

Response:

```json
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
```

### Admin Dashboard Overview

```http
GET /api/admin/dashboard/overview
Authorization: Bearer admin_access_token
```

Response:

```json
{
  "message": "Lay thong ke tong quan dashboard thanh cong",
  "overview": {
    "totalUsers": 10,
    "newUsersToday": 2,
    "blockedUsers": 1,
    "activeUsers": 9,
    "totalFiles": 15,
    "totalNotifications": 30,
    "totalActivityLogs": 80,
    "loginToday": 5
  }
}
```

### User Statistics

```http
GET /api/admin/dashboard/users
Authorization: Bearer admin_access_token
```

Response:

```json
{
  "message": "Lay thong ke nguoi dung thanh cong",
  "statistics": {
    "totalUsers": 10,
    "verifiedUsers": 8,
    "unverifiedUsers": 2,
    "usersByRole": [
      { "role": "ADMIN", "count": 2 },
      { "role": "USER", "count": 8 }
    ],
    "usersByProvider": [
      { "provider": "local", "count": 7 },
      { "provider": "google", "count": 2 }
    ],
    "usersByStatus": [
      { "status": "ACTIVE", "count": 9 },
      { "status": "BLOCKED", "count": 1 }
    ]
  }
}
```

### File Statistics

```http
GET /api/admin/dashboard/files
Authorization: Bearer admin_access_token
```

Response:

```json
{
  "message": "Lay thong ke file upload thanh cong",
  "statistics": {
    "totalFiles": 20,
    "filesUploadedToday": 3,
    "totalSizeBytes": 5242880,
    "totalSizeMB": 5,
    "filesByType": [
      { "type": "IMAGE", "count": 12 },
      { "type": "DOCUMENT", "count": 8 }
    ],
    "filesByFolder": [
      { "folder": "products", "count": 10 },
      { "folder": "documents", "count": 5 },
      { "folder": "avatars", "count": 5 }
    ]
  }
}
```

### System Statistics

```http
GET /api/admin/dashboard/system
Authorization: Bearer admin_access_token
```

Response:

```json
{
  "message": "Lay thong ke he thong thanh cong",
  "statistics": {
    "notifications": {
      "totalNotifications": 30,
      "unreadNotifications": 8,
      "readNotifications": 22,
      "notificationsByType": [
        { "type": "SYSTEM", "count": 15 },
        { "type": "ACCOUNT", "count": 10 }
      ]
    },
    "activityLogs": {
      "totalActivityLogs": 80,
      "activityLogsToday": 12,
      "activityLogsByAction": [
        { "action": "LOGIN", "count": 20 },
        { "action": "UPLOAD_FILE", "count": 10 }
      ],
      "activityLogsByMethod": [
        { "method": "POST", "count": 30 },
        { "method": "PATCH", "count": 20 }
      ]
    }
  }
}
```

### Recent Activities

```http
GET /api/admin/dashboard/recent-activities?limit=5
Authorization: Bearer admin_access_token
```

Response:

```json
{
  "message": "Lay hoat dong gan day thanh cong",
  "recent": {
    "recentUsers": [],
    "recentFiles": [],
    "recentNotifications": [],
    "recentActivityLogs": []
  }
}
```

## Activity Log Actions

```txt
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

Y nghia:

LOGIN: user dang nhap thanh cong
LOGOUT: user dang xuat thanh cong
CHANGE_PASSWORD: user doi mat khau
RESET_PASSWORD: user dat lai mat khau
UPLOAD_FILE: user upload 1 file
UPLOAD_MULTIPLE_FILES: user upload nhieu file
DELETE_FILE: user xoa file
UPDATE_USER_ROLE: admin doi role user
UPDATE_USER_STATUS: admin khoa / mo khoa user
SEND_NOTIFICATION_TO_USER: admin gui thong bao cho 1 user
BROADCAST_NOTIFICATION: admin gui thong bao hang loat
```

---

## Roles & Permissions

| Role  | Description                              |
|-------|------------------------------------------|
| USER  | Standard user, can manage own account    |
| ADMIN | Full access including user management    |

Only accounts with the `ADMIN` role can access `/api/admin/*` routes.

---

## Security Notes

- Passwords are never stored in plain text (hashed with bcrypt).
- Access tokens have a short lifetime.
- Refresh tokens are persisted in the database and can be revoked.
- On logout, the refresh token is revoked.
- On password change or reset, all old refresh tokens are revoked.
- Email verification required for local accounts before login.
- Security alert emails sent on password changes and account status changes.
- **Never commit your `.env` file to GitHub.**

---

## OAuth Configuration

To enable Google and Facebook OAuth, configure the following in `.env`:

```env
# Google OAuth 2.0
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

# Facebook OAuth
FACEBOOK_APP_ID="your_facebook_app_id"
FACEBOOK_APP_SECRET="your_facebook_app_secret"
FACEBOOK_CALLBACK_URL="http://localhost:5000/api/auth/facebook/callback"
```

---

## Email Configuration

To send emails using Gmail SMTP, do not use your regular Gmail password. You need to create a Gmail App Password.

### Steps to create App Password:

1. Go to Google Account
2. Go to Security
3. Enable 2-Step Verification
4. Create App Password for Mail
5. Copy the 16-character password
6. Paste into `EMAIL_PASS` in your `.env` file

### Environment Variables:

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_gmail_app_password"
EMAIL_FROM_NAME="JWT Auth Service"
EMAIL_FROM_ADDRESS="your_email@gmail.com"
```

---

## License

This project is built for educational purposes and final year capstone preparation.




