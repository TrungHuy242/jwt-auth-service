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
| POST   | `/api/admin/notifications/broadcast`       | Admin g?i th?ng b?o h?ng lo?t            |

---

## Request Examples

### Health Check

```http
GET /api/health
```

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




