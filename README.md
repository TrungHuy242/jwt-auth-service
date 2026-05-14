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
