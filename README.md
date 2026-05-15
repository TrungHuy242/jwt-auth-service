# Full-stack Auth Core System

Full-stack Auth Core System là bộ khung hệ thống xác thực và quản trị người dùng được xây dựng bằng **Node.js, Express, Prisma, MySQL, JWT, React, Vite và Tailwind CSS**.

Project này được thiết kế như một nền tảng dùng lại cho nhiều đồ án lớn như:

- Hệ thống bán hàng
- Hệ thống đặt lịch khám
- Hệ thống LMS học trực tuyến
- Hệ thống quản lý sinh viên
- Hệ thống quản lý nhà hàng
- Hệ thống đặt phòng khách sạn
- Hệ thống quản lý công việc

Mục tiêu của project là xây dựng trước các chức năng nền tảng thường gặp trong hệ thống thực tế, để sau này chỉ cần ghép thêm module nghiệp vụ chính theo đề tài.

---

## Tech Stack

### Backend

- Node.js
- Express.js
- Prisma ORM
- MySQL Database
- JWT Authentication
- OAuth Google / Facebook
- Nodemailer
- Multer (File Upload)
- Bcrypt
- CORS
- Dotenv
- Rate Limiter

### Frontend

- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React
- Recharts

---

## Project Structure

```txt
jwt-auth-service/
├── src/                        # Backend source code
│   ├── api/                    # API documentation
│   ├── config/                 # Database & app config
│   ├── controllers/             # Route handlers
│   ├── middlewares/            # Auth, validation, upload, rate limit
│   ├── routes/                 # API routes
│   ├── services/              # Business logic (email, notification, activity log)
│   ├── templates/             # Email HTML templates
│   └── utils/                 # Token utilities
├── prisma/
│   └── schema.prisma           # Database schema
├── frontend/
│   └── src/                   # Frontend source code
│       ├── api/               # API call functions
│       ├── context/            # Auth context
│       ├── pages/             # Page components
│       └── utils/              # Axios client
├── uploads/                    # Uploaded files
├── .env                        # Environment variables
├── .env.example                # Environment template
├── docker-compose.yml           # Docker configuration
├── Dockerfile                  # Docker image
└── README.md                   # This file

---

## Completed Modules

### 1. JWT Authentication Service

- Đăng ký tài khoản
- Đăng nhập bằng JWT
- Refresh token
- Logout
- Đổi mật khẩu
- Quên mật khẩu
- Reset mật khẩu
- Chặn tài khoản bị khóa
- Chặn login nếu chưa xác thực email
- OAuth Google
- OAuth Facebook

### 2. User Profile Management

- Xem hồ sơ cá nhân
- Cập nhật hồ sơ cá nhân
- Upload avatar
- Xóa avatar
- Admin xem danh sách user
- Admin tìm kiếm, lọc, phân trang user
- Admin xem chi tiết user
- Admin đổi role user
- Admin khóa / mở khóa tài khoản

### 3. Upload File Service

- Upload 1 file
- Upload nhiều file
- Lưu metadata file vào database
- Phân loại file theo type
- Lọc file theo folder
- Tìm kiếm file
- Phân trang file
- Xem chi tiết file
- Xóa file vật lý và record database
- User chỉ quản lý file của mình
- Admin quản lý toàn bộ file

### 4. Email Service

- Cấu hình Nodemailer
- Gửi email test
- Gửi email xác thực tài khoản
- Gửi lại email xác thực
- Gửi email reset password
- Gửi email cảnh báo đổi mật khẩu
- Gửi email cảnh báo reset mật khẩu
- Gửi email khi tài khoản bị khóa / mở khóa
- HTML email template dùng lại được

### 5. Notification Service

- User xem danh sách thông báo
- Đếm thông báo chưa đọc
- Đánh dấu 1 thông báo đã đọc
- Đánh dấu tất cả thông báo đã đọc
- Admin gửi thông báo cho 1 user
- Admin gửi thông báo hàng loạt
- Broadcast theo role
- Tự động tạo notification khi đổi role
- Tự động tạo notification khi khóa / mở khóa tài khoản

### 6. Activity Log / Audit Log

- Ghi log login
- Ghi log logout
- Ghi log đổi mật khẩu
- Ghi log reset mật khẩu
- Ghi log upload file
- Ghi log xóa file
- Ghi log admin đổi role user
- Ghi log admin khóa / mở khóa user
- Ghi log admin gửi notification
- Admin xem danh sách activity log
- Admin tìm kiếm, lọc, phân trang activity log
- Admin xem chi tiết activity log

### 7. Admin Dashboard Statistics

- Thống kê tổng quan hệ thống
- Thống kê user theo role
- Thống kê user theo provider
- Thống kê user theo status
- Thống kê user đã verify / chưa verify
- Thống kê file upload theo type
- Thống kê file upload theo folder
- Thống kê notification
- Thống kê activity log
- Xem hoạt động gần đây

### 8. Frontend Core Template

- Login
- Register
- Verify email
- Resend verification email
- Forgot password
- Reset password
- Profile
- Update profile
- Upload avatar
- Delete avatar
- Notifications page
- Admin dashboard
- Admin users management
- Admin activity logs
- Protected route
- Admin route
- Logout

### 9. File Manager Frontend

- User xem danh sách file của mình
- User upload 1 file
- User upload nhiều file
- User tìm kiếm, lọc file theo folder/type
- User xem chi tiết file
- User preview ảnh
- User mở/download file
- User xóa file bằng Confirm Modal
- Admin xem toàn bộ file hệ thống
- Admin xem thông tin người upload
- Admin xóa file bất kỳ

### Frontend Routes

| Path | Description |
|---|---|
| `/files` | User File Manager |
| `/admin/files` | Admin File Manager |

---

## Current Status

Project hiện tại đã hoàn thành phần **full-stack core** gồm backend và frontend.

Có thể dùng ngay làm nền cho các đồ án lớn. Khi chọn đề tài cụ thể, chỉ cần thêm module nghiệp vụ chính.

### Nếu làm hệ thống bán hàng

Cần thêm:

- Product
- Category
- Cart
- Order
- Payment
- Review

### Nếu làm hệ thống đặt lịch khám

Cần thêm:

- Doctor
- Patient
- Appointment
- Medical Record
- Prescription
- Payment

### Nếu làm LMS học trực tuyến

Cần thêm:

- Course
- Lesson
- Enrollment
- Assignment
- Quiz
- Certificate

---

## Requirements

Trước khi chạy project, cần cài:

- Node.js >= 18
- npm hoặc yarn
- SQL Database (MySQL / PostgreSQL / SQL Server) tùy cấu hình Prisma
- Git
- Tài khoản Gmail có App Password nếu muốn dùng Email Service
- Google OAuth App nếu muốn dùng Google Login
- Facebook Developer App nếu muốn dùng Facebook Login

---

## Clone Project

```bash
git clone <your-repository-url>
cd jwt-auth-service
```

Nếu backend và frontend nằm ở 2 repository riêng, clone từng repo:

```bash
git clone <backend-repository-url> backend
git clone <frontend-repository-url> frontend
```

---

## Backend Setup

Di chuyển vào thư mục backend (ở root project):

```bash
npm install
```

Tạo file `.env` từ file mẫu:

```bash
cp .env.example .env
```

Trên Windows CMD có thể dùng:

```bash
copy .env.example .env
```

Cập nhật các biến môi trường trong `.env`.

Ví dụ:

```env
PORT=5000

DATABASE_URL="mysql://root:password@localhost:3306/fullstack_auth_core"

JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

CLIENT_URL="http://localhost:5173"

EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_gmail_app_password"
EMAIL_FROM_NAME="JWT Auth Service"
EMAIL_FROM_ADDRESS="your_email@gmail.com"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

FACEBOOK_APP_ID="your_facebook_app_id"
FACEBOOK_APP_SECRET="your_facebook_app_secret"
FACEBOOK_CALLBACK_URL="http://localhost:5000/api/auth/facebook/callback"
```

Chạy Prisma migrate:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Chạy backend:

```bash
npm run dev
```

Backend sẽ chạy tại:

```txt
http://localhost:5000
```

Health check:

```bash
GET http://localhost:5000/api/health
```

---

## Frontend Setup

Mở terminal mới, di chuyển vào thư mục frontend:

```bash
cd frontend
```

Cài dependencies:

```bash
npm install
```

Tạo file `.env` từ file mẫu:

```bash
cp .env.example .env
```

Trên Windows CMD có thể dùng:

```bash
copy .env.example .env
```

Cập nhật `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Chạy frontend:

```bash
npm run dev
```

Frontend sẽ chạy tại:

```txt
http://localhost:5173
```

---

## Running Order

Nên chạy theo thứ tự:

1. Bật database (MySQL / PostgreSQL)
2. Chạy backend
3. Chạy frontend

**Backend:**

```bash
# (đã ở root project)
npm run dev
```

**Frontend:**

```bash
cd frontend
npm run dev
```

Sau đó mở trình duyệt:

```txt
http://localhost:5173
```

---

## Important Notes

### CLIENT_URL

Backend cần cấu hình:

```env
CLIENT_URL="http://localhost:5173"
```

Biến này dùng để tạo link trong email:

- Verify email
- Reset password

Nếu `CLIENT_URL` sai, link trong email sẽ trỏ sai sang port khác.

### VITE_API_URL

Frontend cần cấu hình:

```env
VITE_API_URL=http://localhost:5000/api
```

Biến này dùng để frontend gọi API backend.

### Upload Folder

Thư mục upload local:

```txt
uploads/
```

Thư mục này không nên push lên GitHub. Trong `.gitignore` nên có:

```gitignore
uploads
```

---

## API Base URL

Backend API chạy tại:

```txt
http://localhost:5000/api
```

Frontend gọi backend thông qua biến môi trường:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Main API Endpoints

### Auth API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Đăng ký tài khoản và gửi email xác thực |
| POST | `/auth/login` | Đăng nhập |
| GET | `/auth/me` | Lấy thông tin user hiện tại |
| POST | `/auth/refresh-token` | Cấp access token mới |
| POST | `/auth/logout` | Đăng xuất |
| PATCH | `/auth/change-password` | Đổi mật khẩu |
| POST | `/auth/forgot-password` | Gửi email đặt lại mật khẩu |
| POST | `/auth/reset-password` | Đặt lại mật khẩu |
| GET | `/auth/verify-email?token=...` | Xác thực email |
| POST | `/auth/resend-verification-email` | Gửi lại email xác thực |
| GET | `/auth/google` | Đăng nhập Google |
| GET | `/auth/google/callback` | Google OAuth callback |
| GET | `/auth/facebook` | Đăng nhập Facebook |
| GET | `/auth/facebook/callback` | Facebook OAuth callback |

### User Profile API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/me` | Xem hồ sơ cá nhân |
| PATCH | `/users/me` | Cập nhật hồ sơ cá nhân |
| PATCH | `/users/me/avatar` | Upload / cập nhật avatar |
| DELETE | `/users/me/avatar` | Xóa avatar |

### Admin User API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/users` | Admin xem danh sách user |
| GET | `/admin/users/:id` | Admin xem chi tiết user |
| PATCH | `/admin/users/:id/role` | Admin đổi role user |
| PATCH | `/admin/users/:id/status` | Admin khóa / mở khóa user |

### Upload File API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/uploads/single` | Upload 1 file |
| POST | `/uploads/multiple` | Upload nhiều file |
| GET | `/uploads` | Lấy danh sách file |
| GET | `/uploads/:id` | Xem chi tiết file |
| DELETE | `/uploads/:id` | Xóa file |

### Notification API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notifications` | User xem danh sách thông báo |
| GET | `/notifications/unread-count` | Đếm thông báo chưa đọc |
| PATCH | `/notifications/:id/read` | Đánh dấu 1 thông báo đã đọc |
| PATCH | `/notifications/read-all` | Đánh dấu tất cả thông báo đã đọc |

### Admin Notification API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/admin/notifications/user/:id` | Admin gửi thông báo cho 1 user |
| POST | `/admin/notifications/broadcast` | Admin gửi thông báo hàng loạt |

### Activity Log API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/activity-logs` | Admin xem danh sách activity log |
| GET | `/admin/activity-logs/:id` | Admin xem chi tiết activity log |

### Admin Dashboard API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/dashboard/overview` | Thống kê tổng quan hệ thống |
| GET | `/admin/dashboard/users` | Thống kê người dùng |
| GET | `/admin/dashboard/files` | Thống kê file upload |
| GET | `/admin/dashboard/system` | Thống kê notification và activity log |
| GET | `/admin/dashboard/recent-activities` | Hoạt động gần đây |

### Email API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/emails/test` | Admin gửi email test |

### Health API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Kiểm tra trạng thái server và database |

---

## Authentication Header

Các API yêu cầu đăng nhập cần gửi header:

```txt
Authorization: Bearer your_access_token
```

Ví dụ:

```bash
GET /api/users/me
Authorization: Bearer your_access_token
```

Các API admin yêu cầu user có role: `ADMIN`

---

## Test Accounts

Bạn có thể tạo tài khoản test bằng API register hoặc seed trực tiếp trong database.

Ví dụ tài khoản dùng để test:

### Admin Account

```txt
Email: admin@gmail.com
Password: 123456
Role: ADMIN
Status: ACTIVE
isVerified: true
```

### User Account

```txt
Email: user@gmail.com
Password: 123456
Role: USER
Status: ACTIVE
isVerified: true
```

### Blocked User Account

```txt
Email: blocked@gmail.com
Password: 123456
Role: USER
Status: BLOCKED
isVerified: true
```

### Unverified User Account

```txt
Email: unverified@gmail.com
Password: 123456
Role: USER
Status: ACTIVE
isVerified: false
```

> **Lưu ý:** Không nên commit tài khoản thật hoặc mật khẩu thật lên GitHub.

---

## Create Admin Account

Nếu chưa có tài khoản admin, có thể tạo user bằng register trước, sau đó cập nhật role trong database.

Ví dụ SQL:

```sql
UPDATE users
SET role = 'ADMIN', isVerified = true, status = 'ACTIVE'
WHERE email = 'admin@gmail.com';
```

Sau đó đăng nhập bằng tài khoản admin để sử dụng các API admin.

---

## Backend Quick Test Flow

Có thể test backend bằng Postman theo thứ tự sau:

### 1. Register

```http
POST /api/auth/register
```

Body:

```json
{
  "name": "Test User",
  "email": "testuser@gmail.com",
  "password": "Test@123456"
}
```

Kết quả:

- User được tạo trong database
- `isVerified = false`
- Email xác thực được gửi đến user

### 2. Verify Email

Mở link verify trong email hoặc gọi trực tiếp:

```http
GET /api/auth/verify-email?token=verify_token
```

Kết quả:

- `isVerified = true`
- `verifyEmailToken = null`
- User có thể đăng nhập

### 3. Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "testuser@gmail.com",
  "password": "Test@123456"
}
```

Kết quả:

- Nhận `accessToken`
- Nhận `refreshToken`
- Nhận thông tin user

### 4. Get Current User

```http
GET /api/auth/me
Authorization: Bearer access_token
```

### 5. Update Profile

```http
PATCH /api/users/me
Authorization: Bearer access_token
```

Body:

```json
{
  "name": "Updated User",
  "phone": "0123456789",
  "address": "Da Nang"
}
```

### 6. Upload File

```http
POST /api/uploads/single
Authorization: Bearer access_token
Content-Type: multipart/form-data
```

Form-data:

```txt
file: selected_file
folder: documents
```

### 7. Get Notifications

```http
GET /api/notifications
Authorization: Bearer access_token
```

### 8. Admin Dashboard

```http
GET /api/admin/dashboard/overview
Authorization: Bearer admin_access_token
```

---

## Frontend Quick Test Flow

Sau khi chạy backend và frontend, mở:

```txt
http://localhost:5173
```

Test theo thứ tự:

### 1. Register

Mở:

```txt
http://localhost:5173/register
```

Đăng ký tài khoản mới.

Kết quả:

- Hiển thị thông báo đăng ký thành công
- Nhận email xác thực

### 2. Verify Email

Bấm link trong email:

```txt
http://localhost:5173/verify-email?token=...
```

Kết quả:

- Xác thực email thành công
- Có thể đăng nhập

### 3. Login

Mở:

```txt
http://localhost:5173/login
```

Đăng nhập bằng tài khoản đã verify.

Kết quả:

- User thường chuyển đến `/profile`
- Admin chuyển đến `/admin/dashboard`

### 4. Profile

Mở:

```txt
http://localhost:5173/profile
```

Test:

- Cập nhật name, phone, address
- Upload avatar
- Xóa avatar

### 5. Notifications

Mở:

```txt
http://localhost:5173/notifications
```

Test:

- Xem danh sách thông báo
- Đánh dấu 1 thông báo đã đọc
- Đánh dấu tất cả đã đọc
- Lọc theo type / trạng thái

### 6. Admin Dashboard

Mở bằng tài khoản ADMIN:

```txt
http://localhost:5173/admin/dashboard
```

Test:

- Xem tổng quan hệ thống
- Xem user statistics
- Xem file statistics
- Xem system statistics
- Xem recent activities

### 7. Admin Users

Mở:

```txt
http://localhost:5173/admin/users
```

Test:

- Tìm kiếm user
- Lọc user
- Đổi role
- Khóa / mở khóa user

### 8. Admin Activity Logs

Mở:

```txt
http://localhost:5173/admin/activity-logs
```

Test:

- Tìm kiếm log
- Lọc theo action / method / userId
- Xem chi tiết log

---

## Demo Checklist

Khi demo project, có thể demo theo thứ tự:

```txt
[ ] Đăng ký tài khoản mới
[ ] Nhận email xác thực
[ ] Xác thực email
[ ] Đăng nhập
[ ] Cập nhật profile
[ ] Upload avatar
[ ] Xem notification
[ ] Admin xem dashboard
[ ] Admin quản lý user
[ ] Admin khóa / mở khóa user
[ ] Admin gửi notification
[ ] Admin xem activity log
[ ] Forgot password
[ ] Reset password qua email
[ ] Logout
```

---

## Main System Flows

### 1. Register and Verify Email Flow

```txt
User nhập thông tin đăng ký
        ↓
Frontend gọi POST /api/auth/register
        ↓
Backend kiểm tra email đã tồn tại chưa
        ↓
Backend hash password bằng bcrypt
        ↓
Backend tạo verifyEmailToken
        ↓
Backend lưu user với isVerified = false
        ↓
Backend gửi email xác thực bằng Nodemailer
        ↓
User bấm link xác thực trong email
        ↓
Frontend mở /verify-email?token=...
        ↓
Frontend gọi GET /api/auth/verify-email?token=...
        ↓
Backend kiểm tra token
        ↓
Backend cập nhật isVerified = true
        ↓
User có thể đăng nhập
```

**Ý nghĩa:**

- Tài khoản local phải xác thực email mới được đăng nhập.
- Google/Facebook login được xem là đã xác thực.
- Token xác thực email có thời hạn để tăng bảo mật.

### 2. JWT Login Flow

```txt
User nhập email và password
        ↓
Frontend gọi POST /api/auth/login
        ↓
Backend kiểm tra email
        ↓
Backend kiểm tra password bằng bcrypt
        ↓
Backend kiểm tra user có bị BLOCKED không
        ↓
Backend kiểm tra user local đã verify email chưa
        ↓
Backend tạo accessToken và refreshToken
        ↓
Backend lưu refreshToken vào database
        ↓
Backend trả token và user information
        ↓
Frontend lưu token vào localStorage
        ↓
Frontend chuyển user đến /profile hoặc /admin/dashboard
```

**Token:**

- `accessToken`: dùng để gọi API cần đăng nhập
- `refreshToken`: dùng để cấp lại accessToken hoặc logout

### 3. Forgot Password and Reset Password Flow

```txt
User nhập email quên mật khẩu
        ↓
Frontend gọi POST /api/auth/forgot-password
        ↓
Backend kiểm tra tài khoản local
        ↓
Backend tạo resetPasswordToken
        ↓
Backend lưu token và thời hạn trong database
        ↓
Backend gửi email reset password
        ↓
User bấm link trong email
        ↓
Frontend mở /reset-password?token=...
        ↓
User nhập mật khẩu mới
        ↓
Frontend gọi POST /api/auth/reset-password
        ↓
Backend kiểm tra token
        ↓
Backend hash mật khẩu mới
        ↓
Backend cập nhật password
        ↓
Backend xóa resetPasswordToken
        ↓
Backend thu hồi refresh token cũ
        ↓
Backend gửi email cảnh báo bảo mật
        ↓
User đăng nhập lại bằng mật khẩu mới
```

**Ý nghĩa:**

- Backend không trả reset token trực tiếp trong response.
- Reset token chỉ được gửi qua email.
- Sau khi reset mật khẩu, các phiên đăng nhập cũ bị thu hồi.

### 4. Upload File Flow

```txt
User chọn file trên frontend
        ↓
Frontend tạo FormData
        ↓
Frontend gọi POST /api/uploads/single hoặc /api/uploads/multiple
        ↓
Backend kiểm tra JWT
        ↓
Multer kiểm tra loại file và dung lượng
        ↓
Backend lưu file vào thư mục uploads/{folder}
        ↓
Backend lưu metadata vào bảng UploadedFile
        ↓
Backend trả fileUrl
        ↓
Frontend hiển thị hoặc sử dụng fileUrl
```

**Metadata được lưu:**

- `originalName`, `fileName`, `filePath`, `fileUrl`
- `mimeType`, `size`, `folder`, `type`
- `uploadedById`

**Quyền truy cập:**

- User thường chỉ xem / xóa file của mình.
- Admin xem / xóa được tất cả file.

### 5. Notification Flow

```txt
Hệ thống hoặc admin tạo notification
        ↓
Notification được lưu vào database
        ↓
User gọi GET /api/notifications
        ↓
Frontend hiển thị danh sách thông báo
        ↓
User có thể đánh dấu 1 thông báo đã đọc
        ↓
User có thể đánh dấu tất cả thông báo đã đọc
```

**Notification được tạo trong các trường hợp:**

- Admin gửi thông báo cho 1 user.
- Admin broadcast thông báo.
- Admin đổi role user.
- Admin khóa / mở khóa user.

**Notification types:**

- `SYSTEM`, `SECURITY`, `ACCOUNT`, `ORDER`
- `APPOINTMENT`, `COURSE`, `OTHER`

### 6. Activity Log Flow

```txt
User hoặc admin thực hiện hành động quan trọng
        ↓
Backend gọi createActivityLog()
        ↓
Log được lưu vào bảng ActivityLog
        ↓
Admin gọi GET /api/admin/activity-logs
        ↓
Frontend hiển thị bảng activity log
        ↓
Admin có thể tìm kiếm, lọc và xem chi tiết log
```

**Các hành động đang được ghi log:**

- `LOGIN`, `LOGOUT`, `CHANGE_PASSWORD`, `RESET_PASSWORD`
- `UPLOAD_FILE`, `UPLOAD_MULTIPLE_FILES`, `DELETE_FILE`
- `UPDATE_USER_ROLE`, `UPDATE_USER_STATUS`
- `SEND_NOTIFICATION_TO_USER`, `BROADCAST_NOTIFICATION`

**Mỗi log lưu:**

- `userId`, `action`, `method`, `path`, `ip`
- `userAgent`, `details`, `createdAt`

### 7. Admin Lock / Unlock User Flow

```txt
Admin chọn user cần khóa / mở khóa
        ↓
Frontend gọi PATCH /api/admin/users/:id/status
        ↓
Backend kiểm tra quyền ADMIN
        ↓
Backend kiểm tra admin không tự khóa chính mình
        ↓
Backend cập nhật status user
        ↓
Nếu BLOCKED thì thu hồi refresh token của user
        ↓
Backend gửi email thông báo cho user
        ↓
Backend tạo notification cho user
        ↓
Backend ghi activity log
        ↓
Frontend cập nhật lại danh sách user
```

**Ý nghĩa:**

- User bị khóa không thể login.
- User bị khóa sẽ nhận email thông báo.
- Khi mở khóa, user có thể login lại.

### 8. Admin Dashboard Flow

```txt
Admin đăng nhập
        ↓
Frontend kiểm tra user.role === ADMIN
        ↓
Admin truy cập /admin/dashboard
        ↓
Frontend gọi các dashboard APIs
        ↓
Backend tổng hợp số liệu từ nhiều bảng
        ↓
Frontend hiển thị card thống kê và hoạt động gần đây
```

**Dashboard lấy dữ liệu từ:**

- `User`, `UploadedFile`, `Notification`, `ActivityLog`

**Các nhóm thống kê:**

- Overview statistics
- User statistics
- File statistics
- Notification statistics
- Activity log statistics
- Recent activities

---

## Security Features

Project đã tích hợp nhiều cơ chế bảo mật cơ bản thường dùng trong hệ thống thực tế.

### 1. Password Hashing

Mật khẩu người dùng không được lưu trực tiếp trong database.

Backend sử dụng `bcrypt` để hash password trước khi lưu.

```txt
Plain password
      ↓
bcrypt hash
      ↓
Save hashed password to database
```

### 2. JWT Authentication

Hệ thống sử dụng JWT để xác thực người dùng.

- `accessToken`: dùng để gọi API
- `refreshToken`: dùng để cấp lại accessToken

Access token có thời hạn ngắn, refresh token có thời hạn dài hơn và được lưu trong database để có thể thu hồi khi cần.

### 3. Refresh Token Revocation

Refresh token sẽ bị thu hồi trong các trường hợp:

- User logout
- User đổi mật khẩu
- User reset mật khẩu
- Admin khóa tài khoản user
- Admin đổi role user

### 4. Email Verification

User đăng ký bằng email/password phải xác thực email trước khi đăng nhập.

- `isVerified = false` → không được login
- `isVerified = true` → được login

### 5. Forgot Password Security

Reset password token không được trả trực tiếp trong response.

Token chỉ được gửi qua email.

Sau khi reset password thành công:

- Password được cập nhật
- Reset token bị xóa
- Refresh token cũ bị thu hồi
- User nhận email cảnh báo bảo mật

### 6. Role-based Access Control

Hệ thống có phân quyền theo role:

- `USER`
- `ADMIN`

Các API admin chỉ cho phép user có role `ADMIN` truy cập.

### 7. Account Status Check

User có status `BLOCKED` sẽ không được đăng nhập.

- `ACTIVE` → được login
- `BLOCKED` → không được login

### 8. File Upload Validation

Upload file có kiểm tra:

- Loại file
- Kích thước file
- Field upload
- User sở hữu file

User thường chỉ được quản lý file của chính mình.

### 9. Activity Log

Các hành động quan trọng đều được ghi log để admin truy vết.

Ví dụ:

- Login / Logout
- Change password / Reset password
- Upload file / Delete file
- Admin đổi role / Khóa / Mở khóa user

### 10. Admin Protection

Backend nên chặn các thao tác nguy hiểm như:

- Admin tự khóa chính mình
- Admin tự hạ role chính mình
- User thường gọi API admin

---

## Role and Permission Summary

### USER

User thường có thể:

- Đăng ký tài khoản
- Xác thực email
- Đăng nhập
- Xem hồ sơ cá nhân
- Cập nhật hồ sơ cá nhân
- Upload avatar
- Upload file cá nhân
- Xem file của chính mình
- Xóa file của chính mình
- Xem thông báo của chính mình
- Đánh dấu thông báo đã đọc
- Đổi mật khẩu
- Reset mật khẩu

### ADMIN

Admin có toàn bộ quyền của USER, ngoài ra có thể:

- Xem danh sách user
- Tìm kiếm, lọc, phân trang user
- Xem chi tiết user
- Đổi role user
- Khóa / mở khóa user
- Xem toàn bộ file upload
- Xóa file của bất kỳ user nào
- Gửi notification cho 1 user
- Broadcast notification
- Xem activity logs
- Xem dashboard statistics
- Gửi email test

---

## Environment Variables Summary

### Backend `.env`

```env
PORT=5000
DATABASE_URL="your_database_url"

JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

CLIENT_URL="http://localhost:5173"

EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_gmail_app_password"
EMAIL_FROM_NAME="JWT Auth Service"
EMAIL_FROM_ADDRESS="your_email@gmail.com"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

FACEBOOK_APP_ID="your_facebook_app_id"
FACEBOOK_APP_SECRET="your_facebook_app_secret"
FACEBOOK_CALLBACK_URL="http://localhost:5000/api/auth/facebook/callback"
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Common Issues

### 1. Frontend không gọi được backend

Kiểm tra frontend `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Sau khi sửa `.env`, cần restart frontend.

### 2. Link email trỏ sai port

Kiểm tra backend `.env`:

```env
CLIENT_URL="http://localhost:5173"
```

Sau khi sửa `.env`, cần restart backend.

### 3. Không gửi được email

Kiểm tra:

- Gmail đã bật 2-Step Verification chưa
- Đã tạo Gmail App Password chưa
- `EMAIL_USER` đúng chưa
- `EMAIL_PASS` có phải App Password không
- Backend đã restart sau khi sửa `.env` chưa

### 4. Prisma không nhận field mới

Chạy lại:

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Upload file lỗi Unexpected field

Kiểm tra key form-data:

- Upload single: `file`
- Upload multiple: `files`
- Upload avatar: `avatar`

### 6. User không vào được admin dashboard

Kiểm tra user có role: `ADMIN`

Nếu là `USER`, frontend sẽ chuyển về `/profile`.

### 7. User login bị báo chưa xác thực email

Kiểm tra trong database: `isVerified = true`

Nếu vẫn là `false`, cần xác thực email hoặc gọi API resend verification email.

---

## Screenshots

Bạn có thể thêm ảnh demo vào thư mục:

```txt
screenshots/
```

**Gợi ý các ảnh nên chụp:**

- `screenshots/login.png`
- `screenshots/register.png`
- `screenshots/profile.png`
- `screenshots/notifications.png`
- `screenshots/admin-dashboard.png`
- `screenshots/admin-users.png`
- `screenshots/admin-activity-logs.png`

**Ví dụ hiển thị trong README:**

### Login Page

![Login Page](./screenshots/login.png)

### Admin Dashboard

![Admin Dashboard](./screenshots/admin-dashboard.png)

### Admin Users Management

![Admin Users](./screenshots/admin-users.png)

### Activity Logs

![Activity Logs](./screenshots/admin-activity-logs.png)

---

## Main Database Models

Project hiện tại sử dụng các model chính:

### User

Lưu thông tin tài khoản người dùng:

- `id`, `name`, `email`, `password`, `role`, `provider`
- `isVerified`, `status`, `phone`, `address`, `avatar`
- `lastLoginAt`
- `resetPasswordToken`, `resetPasswordExpires`
- `verifyEmailToken`, `verifyEmailExpires`
- `createdAt`, `updatedAt`

### RefreshToken

Lưu refresh token để quản lý phiên đăng nhập:

- `id`, `token`, `userId`, `expiresAt`, `revokedAt`, `createdAt`

### UploadedFile

Lưu metadata file upload:

- `id`, `originalName`, `fileName`, `filePath`, `fileUrl`
- `mimeType`, `size`, `folder`, `type`, `uploadedById`
- `createdAt`, `updatedAt`

### Notification

Lưu thông báo trong hệ thống:

- `id`, `userId`, `title`, `message`, `type`
- `isRead`, `link`, `createdAt`, `updatedAt`

### ActivityLog

Lưu lịch sử hoạt động quan trọng:

- `id`, `userId`, `action`, `method`, `path`
- `ip`, `userAgent`, `details`, `createdAt`

---

## Future Development

Project này là core system. Có thể mở rộng thành nhiều đồ án lớn.

### Option 1: E-commerce System

Có thể thêm:

- Product Management
- Category Management
- Cart
- Order
- Payment
- Product Review
- Coupon / Promotion
- Inventory Management

### Option 2: Appointment Booking System

Có thể thêm:

- Doctor Management
- Patient Management
- Appointment Booking
- Medical Record
- Prescription
- Payment
- Doctor Schedule
- Appointment Reminder

### Option 3: LMS E-learning System

Có thể thêm:

- Course Management
- Lesson Management
- Enrollment
- Assignment
- Quiz
- Certificate
- Student Progress
- Teacher Dashboard

### Option 4: Student Management System

Có thể thêm:

- Class Management
- Subject Management
- Student Record
- Attendance
- Score Management
- Report Export

---

## Suggested Roadmap

Nếu tiếp tục phát triển project này, có thể đi theo roadmap:

```txt
Phase 1: Core System
[✓] Auth Service
[✓] User Profile
[✓] Upload File
[✓] Email Service
[✓] Notification Service
[✓] Activity Log
[✓] Admin Dashboard
[✓] Frontend Core Template

Phase 2: Production Improvements
[ ] Refresh token auto-renew trên frontend
[ ] Toast notification UI
[ ] Loading skeleton
[ ] Form validation nâng cao
[ ] Error boundary
[ ] Docker compose backend + frontend + database
[ ] API rate limiting nâng cao
[ ] Unit test
[ ] Integration test

Phase 3: Business Module
[ ] Chọn đề tài chính
[ ] Thiết kế database module nghiệp vụ
[ ] Xây API module nghiệp vụ
[ ] Xây UI module nghiệp vụ
[ ] Tích hợp notification/email/activity log
[ ] Viết báo cáo đồ án
```

---

## Git Commit Convention

Gợi ý cách đặt commit message:

```txt
feat: add login feature
feat: add notification service
fix: resolve upload avatar issue
docs: update API documentation
refactor: clean auth controller
style: update dashboard UI
test: add auth API tests
chore: update dependencies
```

**Ví dụ:**

```bash
git add .
git commit -m "docs: add fullstack project README"
git push
```

---

## License

This project is built for learning and academic purposes.

You can reuse and extend it for student projects, graduation projects, or personal portfolio projects.

---

## Author

Developed by: **Your Name**

**Project purpose:**

```txt
Prepare reusable full-stack core modules for final year student projects.
```

> Bạn có thể đổi `Your Name` thành tên của bạn.
