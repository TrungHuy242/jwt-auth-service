# Deployment Guide

## 1. Project Overview

This is a Universal Full-stack Admin Starter Kit built with:

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Lucide React, Recharts
- **Backend:** Node.js, Express.js, Prisma ORM
- **Database:** MySQL 8.0
- **Authentication:** JWT Access Token + Refresh Token
- **Authorization:** Role & Permission Management
- **Email:** Nodemailer (Gmail SMTP)
- **OAuth:** Google & Facebook Login
- **File Upload:** Multer
- **Containerization:** Docker Compose + Nginx

## 2. Main Features

- JWT Authentication (Register, Login, Logout)
- Auto Refresh Token
- Email Verification
- Forgot / Reset Password
- OAuth Google & Facebook Login
- User Profile Management
- Avatar Upload / Delete
- File Manager (upload, preview, delete)
- Admin Dashboard with Statistics
- Activity Logs / Audit Logs
- Export Activity Logs to Excel
- Notification System with Dropdown Bell
- System Settings Management
- Role and Permission Management
- Toast Notifications
- Confirm Modal
- Loading Skeleton
- React Hook Form + Zod Validation
- Docker Compose (MySQL + Backend + Nginx)

---

## 3. Requirements

### Run without Docker

- Node.js >= 20
- MySQL >= 8.0
- npm
- Git
- Gmail account with App Password (for email features)
- Google OAuth App (optional, for Google login)
- Facebook Developer App (optional, for Facebook login)

### Run with Docker

- Docker
- Docker Compose

---

## 4. Project Structure

```
jwt-auth-service/
├── src/                          # Backend source code
│   ├── api/                      # API docs
│   ├── config/                    # Database & app config
│   ├── controllers/               # Route handlers
│   ├── middlewares/               # Auth, validation, upload, rate limit
│   ├── routes/                    # API routes
│   ├── services/                  # Business logic
│   ├── templates/                  # Email HTML templates
│   └── utils/                     # Token utilities
├── prisma/
│   └── schema.prisma               # Database schema
├── frontend/
│   └── src/                       # Frontend source code
│       ├── api/                   # API call functions
│       ├── context/               # Auth context
│       ├── pages/                 # Page components
│       └── utils/                 # Axios client
├── uploads/                       # Uploaded files (gitignored)
├── .env                           # Root env (gitignored)
├── docker-compose.yml              # Docker configuration
├── Dockerfile                      # Backend Docker image
├── README.md                       # Project documentation
└── DEPLOYMENT.md                   # This file
```

---

## 5. Environment Variables

### Backend

Create file: `backend/.env`

```env
NODE_ENV=development
PORT=5000

DATABASE_URL=mysql://root:root@localhost:3306/jwt_auth_service

JWT_ACCESS_SECRET=change_me_access_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change_me_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:5174

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback
```

### Frontend

Create file: `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 6. Run Project Locally Without Docker

### 6.1. Setup MySQL Database

Create a MySQL database:

```sql
CREATE DATABASE jwt_auth_service CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 6.2. Install Backend Dependencies

```bash
cd jwt-auth-service
npm install
```

### 6.3. Setup Environment

```bash
# Windows CMD
copy .env.example .env

# Linux / macOS
cp .env.example .env
```

Edit `backend/.env` with your database credentials and secrets.

### 6.4. Run Prisma Migration

```bash
npm run db:migrate
npm run db:generate
```

### 6.5. Seed Roles and Permissions

```bash
npm run seed:roles
```

### 6.6. Start Backend

```bash
npm run dev
```

Backend will run at: `http://localhost:5000`

### 6.7. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6.8. Setup Frontend Environment

```bash
# Windows CMD
copy .env.example .env

# Linux / macOS
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6.9. Start Frontend

```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## 7. Run Project With Docker Compose

### 7.1. Prepare Env Files

```bash
# Windows CMD
copy backend\.env.docker.example backend\.env.docker
copy frontend\.env.docker.example frontend\.env.docker

# Linux / macOS
cp backend/.env.docker.example backend/.env.docker
cp frontend/.env.docker.example frontend/.env.docker
```

Update secrets in `backend/.env.docker`.

### 7.2. Build and Start All Services

At project root:

```bash
docker compose up -d --build
```

This will start:

- MySQL 8.0 database
- Backend API on port `5001` (internal port `5000`)
- Frontend Nginx server on port `5173`

### 7.3. Initialize Database

```bash
docker compose exec backend npx prisma db push
docker compose exec backend npm run seed:roles
```

### 7.4. Open App

Frontend:

```
http://localhost:5173
```

Backend API:

```
http://localhost:5001/api
```

Public settings API:

```
http://localhost:5001/api/settings/public
```

### 7.5. View Logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f database
```

### 7.6. Stop Services

```bash
docker compose down
```

### 7.7. Reset Database Volume

```bash
docker compose down -v
docker compose up -d --build
docker compose exec backend npx prisma db push
docker compose exec backend npm run seed:roles
```

---

## 8. Useful Docker Commands

Check containers:

```bash
docker compose ps
```

Open backend shell:

```bash
docker compose exec backend sh
```

Run Prisma migration manually:

```bash
docker compose exec backend npx prisma db push
```

Run role seed manually:

```bash
docker compose exec backend npm run seed:roles
```

Rebuild without cache:

```bash
docker compose build --no-cache
docker compose up -d
```

---

## 9. Create Admin Account

After seeding roles, register a user via the frontend or API, then promote to admin:

### Via SQL:

```sql
UPDATE users
SET role = 'ADMIN', isVerified = true, status = 'ACTIVE'
WHERE email = 'admin@example.com';
```

### Via Prisma:

```bash
npx prisma studio
```

Navigate to the `User` table, find your user, and set `role` to `ADMIN`, `isVerified` to `true`, `status` to `ACTIVE`.

---

## 10. Production Deployment Notes

### Backend

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your_production_mysql_url
JWT_ACCESS_SECRET=strong_random_secret_at_least_32_chars
JWT_REFRESH_SECRET=another_strong_random_secret
CLIENT_URL=https://your-frontend-domain.com
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Frontend

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Security Checklist

- [ ] Use strong, random JWT secrets (min 32 characters)
- [ ] Do not commit `.env` files
- [ ] Use HTTPS in production
- [ ] Configure `ALLOWED_ORIGINS` for the production frontend domain
- [ ] Configure real SMTP credentials
- [ ] Configure Google OAuth callback URLs for the production domain
- [ ] Configure Facebook OAuth callback URLs for the production domain
- [ ] Backup database regularly
- [ ] Keep dependencies updated

---

## 11. Troubleshooting

### Backend cannot connect to database

Check `DATABASE_URL`.

For Docker Compose, database host must be:

```
database
```

Example:

```
DATABASE_URL=mysql://root:root@database:3306/jwt_auth_service
```

For local development, database host is usually:

```
localhost
```

### Prisma client error

```bash
npx prisma generate
npx prisma db push
```

### Permission menu not showing

Run seed:

```bash
npm run seed:roles
```

Then login again.

### Frontend cannot call backend

Check `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Cannot send email

Make sure you:

1. Enabled 2-Step Verification on your Gmail account
2. Created an App Password (16 characters)
3. Set `EMAIL_USER` and `EMAIL_PASS` correctly (use App Password, not your regular password)

### Uploaded files disappear after container restart

Make sure Docker Compose has volume mapping for uploads:

```yaml
volumes:
  - ./uploads:/app/uploads
```

### Docker containers fail to start

Check container logs:

```bash
docker compose logs backend
docker compose logs database
```

Ensure port `3306` (MySQL), `5001` (backend), and `5173` (frontend) are not already in use.

---

## 12. Final Submission Checklist

Before submitting your project:

### Local Development

- [ ] Backend runs locally (`npm run dev`)
- [ ] Frontend runs locally (`cd frontend && npm run dev`)
- [ ] Database migrations work (`npm run db:migrate`)
- [ ] Role/permission seed works (`npm run seed:roles`)
- [ ] Login/Register works
- [ ] Email verification works
- [ ] Admin dashboard works
- [ ] File upload works
- [ ] Notification dropdown works
- [ ] Activity log export Excel works
- [ ] System settings works
- [ ] Role permission management works

### Docker

- [ ] `docker compose up -d --build` runs successfully
- [ ] All three services (database, backend, frontend) are healthy

### Documentation

- [ ] README.md is updated and complete
- [ ] DEPLOYMENT.md is created and accurate
- [ ] `.env.example` / `.env.docker.example` files are committed
- [ ] `.env` files are NOT committed
- [ ] `uploads/` folder is gitignored

### Security

- [ ] No real credentials (passwords, secrets, API keys) are committed
- [ ] `.gitignore` correctly excludes sensitive files
