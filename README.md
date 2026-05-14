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
│   ├── services/               # Business logic (email, notification, activity log)
│   ├── templates/              # Email HTML templates
│   └── utils/                 # Token utilities
├── prisma/
│   └── schema.prisma           # Database schema
├── frontend/
│   └── src/                   # Frontend source code
│       ├── api/               # API call functions
│       ├── context/           # Auth context
│       ├── pages/             # Page components
│       └── utils/             # Axios client
├── uploads/                   # Uploaded files
├── .env                       # Environment variables
├── .env.example               # Environment template
├── docker-compose.yml         # Docker configuration
├── Dockerfile                # Docker image
└── README.md                 # This file

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
