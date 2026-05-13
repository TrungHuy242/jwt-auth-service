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
  - [User Profile API](#user-profile-api)
  - [Admin API](#admin-api)
- [Request Examples](#request-examples)
- [Roles & Permissions](#roles--permissions)
- [Security Notes](#security-notes)
- [OAuth Configuration](#oauth-configuration)
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
- Admin xem chi tiết người dùng
- Admin đổi role người dùng
- Admin khóa / mở khóa tài khoản
- Admin tìm kiếm, lọc, phân trang danh sách người dùng
- Middleware phân quyền linh hoạt theo role
- Rate limiting (anti-spam)
- Helmet HTTP security headers
- Health check endpoint with database status
- Docker containerization with MySQL

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
| Environment    | Dotenv              |
| Container      | Docker + Compose    |

---

## Project Structure

```txt
jwt-auth-service/
|
|-- prisma/
|   |-- schema.prisma
|
|-- src/
|   |-- config/
|   |   |-- prisma.js
|   |   |-- passport.js
|   |
|   |-- controllers/
|   |   |-- auth.controller.js
|   |   |-- user.controller.js
|   |   |-- admin.controller.js
|   |
|   |-- middlewares/
|   |   |-- auth.middleware.js
|   |   |-- upload.middleware.js
|   |   |-- validate.middleware.js
|   |   |-- rateLimit.middleware.js
|   |
|   |-- routes/
|   |   |-- auth.routes.js
|   |   |-- user.routes.js
|   |   |-- admin.routes.js
|   |   |-- health.routes.js
|   |
|   |-- services/
|   |   |-- auth.service.js
|   |
|   |-- utils/
|   |   |-- token.js
|   |
|   |-- server.js
|
|-- .dockerignore
|-- Dockerfile
|-- docker-compose.yml
|-- .env.example
|-- .gitignore
|-- uploads/
|   |-- avatars/
|-- package.json
|-- README.md
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

| Method | Endpoint                      | Description          |
|--------|-------------------------------|----------------------|
| POST   | `/api/auth/register`           | Register new account |
| POST   | `/api/auth/login`             | Login                |
| GET    | `/api/auth/me`                | Get current user     |
| POST   | `/api/auth/refresh-token`      | Refresh access token |
| POST   | `/api/auth/logout`             | Logout               |
| PATCH  | `/api/auth/change-password`   | Change password      |
| POST   | `/api/auth/forgot-password`   | Forgot password      |
| POST   | `/api/auth/reset-password`    | Reset password       |
| GET    | `/api/auth/google`            | Google login         |
| GET    | `/api/auth/google/callback`   | Google callback      |
| GET    | `/api/auth/facebook`          | Facebook login       |
| GET    | `/api/auth/facebook/callback`  | Facebook callback    |

### User Profile API

| Method | Endpoint               | Description                    |
|--------|------------------------|--------------------------------|
| GET    | `/api/users/me`        | View current user profile      |
| PATCH  | `/api/users/me`        | Update current user profile    |
| PATCH  | `/api/users/me/avatar` | Upload / update avatar        |
| DELETE | `/api/users/me/avatar` | Delete avatar                  |

### Admin API

| Method | Endpoint                    | Description                                      |
|--------|-----------------------------|--------------------------------------------------|
| GET    | `/api/admin/users`          | Admin list users with pagination/search/filter  |
| GET    | `/api/admin/users/:id`      | Admin view user details                          |
| PATCH  | `/api/admin/users/:id/role`  | Admin change user role                           |
| PATCH  | `/api/admin/users/:id/status`| Admin lock / unlock account                     |

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

## License

This project is built for educational purposes and final year capstone preparation.
