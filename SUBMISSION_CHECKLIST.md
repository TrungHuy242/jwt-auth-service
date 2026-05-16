# Submission Checklist

Use this checklist before submitting your project for thesis defense, portfolio, or sharing.

---

## 1. Documentation

- [ ] `README.md` is complete and up-to-date
- [ ] `DEPLOYMENT.md` is created with setup instructions
- [ ] `package.json` scripts are correct (`db:migrate`, `db:generate`, `seed:roles`, `dev`)
- [ ] `.env.example` / `.env.docker.example` files are committed
- [ ] `DEPLOYMENT.md` is listed in Project Structure
- [ ] API endpoints are documented in README

---

## 2. Environment & Security

- [ ] `.env` file contains placeholder values (no real secrets committed)
- [ ] `.gitignore` excludes `.env`, `.env.*`, `node_modules/`, `uploads/*`
- [ ] `frontend/.env` exists and is gitignored
- [ ] `frontend/.env.example` is committed
- [ ] `.env.docker` is gitignored
- [ ] `.env.docker.example` is committed
- [ ] No Google OAuth `CLIENT_ID` / `CLIENT_SECRET` committed
- [ ] No Facebook OAuth `APP_ID` / `APP_SECRET` committed
- [ ] No Gmail `EMAIL_USER` / `EMAIL_PASS` committed
- [ ] No real JWT `ACCESS_SECRET` / `REFRESH_SECRET` committed
- [ ] No database password in committed files

---

## 3. Local Development (Without Docker)

### Backend

- [ ] Run `npm install` at project root successfully
- [ ] Run `npm run db:migrate` creates all tables
- [ ] Run `npm run db:generate` generates Prisma client
- [ ] Run `npm run seed:roles` seeds roles and permissions
- [ ] Run `npm run dev` starts backend on `http://localhost:5000`
- [ ] `GET /api/health` returns healthy response

### Frontend

- [ ] Run `npm install` in `frontend/` successfully
- [ ] Run `npm run dev` starts frontend on `http://localhost:5173`
- [ ] Frontend loads without errors

### Features

- [ ] Register a new user account
- [ ] Verify email via link
- [ ] Login with verified account
- [ ] View and update user profile
- [ ] Upload and delete avatar
- [ ] Notification dropdown shows unread badge
- [ ] Mark notification as read
- [ ] Mark all notifications as read
- [ ] Create admin account (update role to ADMIN in DB)
- [ ] Login as admin
- [ ] Access `/admin/dashboard`
- [ ] View dashboard statistics (overview, users, files, system)
- [ ] View `/admin/users` with search and pagination
- [ ] Change user role from Admin panel
- [ ] Block / unblock user from Admin panel
- [ ] View `/admin/files` (admin file manager)
- [ ] Upload a file from admin panel
- [ ] Delete a file from admin panel
- [ ] View `/admin/activity-logs`
- [ ] Filter activity logs by action, method, user
- [ ] View activity log detail
- [ ] Export activity logs to Excel
- [ ] View `/admin/settings`
- [ ] Update site name and logo
- [ ] Toggle registration, Google login, Facebook login
- [ ] View `/admin/roles`
- [ ] Create a custom role (e.g., MANAGER)
- [ ] Assign permissions to custom role
- [ ] Assign custom role to a user
- [ ] View `/files` (user file manager)
- [ ] Upload files as regular user
- [ ] Delete own files
- [ ] Forgot password flow (receive email)
- [ ] Reset password via email link
- [ ] Google Login (if configured)
- [ ] Facebook Login (if configured)
- [ ] Change password from profile page
- [ ] Logout clears session properly

---

## 4. Docker Compose

- [ ] `docker compose up -d --build` starts all 3 services without error
- [ ] MySQL container runs on port `3306`
- [ ] Backend container runs on port `5001`
- [ ] Frontend container runs on port `5173`
- [ ] `docker compose exec backend npx prisma db push` succeeds
- [ ] `docker compose exec backend npm run seed:roles` succeeds
- [ ] App is accessible at `http://localhost:5173`
- [ ] Backend API is accessible at `http://localhost:5001/api`
- [ ] Uploaded files persist in `./uploads` volume
- [ ] `docker compose logs backend` shows no errors
- [ ] `docker compose down` stops all services cleanly
- [ ] `docker compose down -v` removes database volume

---

## 5. Code Quality

- [ ] No `console.log` left in production code (or only for debugging)
- [ ] All API routes have proper error handling
- [ ] File upload has size and type validation
- [ ] Admin routes are protected by middleware
- [ ] Permission middleware is applied to admin APIs
- [ ] Database queries use Prisma safely (no raw SQL injection)
- [ ] No hardcoded credentials in source code

---

## 6. Database

- [ ] Prisma schema matches running database (no missing fields)
- [ ] All migrations are in `prisma/migrations/`
- [ ] `seed.js` runs without error
- [ ] Roles table has ADMIN, USER (and custom roles if created)
- [ ] Permissions table has all expected permission keys

---

## 7. Git

- [ ] `git status` shows no unexpected changes
- [ ] All documentation files are committed
- [ ] All `.env.*.example` files are committed
- [ ] No `.env` files are committed
- [ ] `node_modules/` is not committed
- [ ] `uploads/` is not committed
- [ ] Commit messages follow convention (feat:, fix:, docs:, etc.)
- [ ] Latest commit does not include test files (e.g., `test-avatar.png`)

---

## 8. Final Submission Package

Before packaging for submission:

- [ ] All source code is in one repository
- [ ] README.md is at project root
- [ ] DEPLOYMENT.md is at project root
- [ ] Submission package includes:
  - Source code (excluding node_modules, uploads, .env)
  - Database schema (prisma/schema.prisma + migrations)
  - Docker files (Dockerfile, docker-compose.yml, nginx.conf)
  - Environment templates (.env.example, .env.docker.example)
  - Documentation (README.md, DEPLOYMENT.md)
- [ ] If submitting as ZIP:
  - Exclude `node_modules/`
  - Exclude `.env`
  - Exclude `uploads/`
  - Include `.env.example` (not `.env`)
  - Include `DEPLOYMENT.md`

---

## Quick Commands Reference

```bash
# Local setup
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm run db:migrate
npm run db:generate
npm run seed:roles
npm run dev

# Frontend
cd frontend
npm install
cp .env.example .env
npm run dev

# Docker
cp .env.docker.example .env.docker
cp frontend/.env.docker.example frontend/.env.docker
docker compose up -d --build
docker compose exec backend npx prisma db push
docker compose exec backend npm run seed:roles

# Open app
# Frontend: http://localhost:5173
# Backend:  http://localhost:5001/api
```
