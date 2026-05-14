# BÁO CÁO PHÂN TÍCH THIẾT KẾ HỆ THỐNG

**ĐỀ TÀI:**

# XÂY DỰNG HỆ THỐNG LÕI XÁC THỰC, QUẢN LÝ NGƯỜI DÙNG VÀ QUẢN TRỊ HỆ THỐNG FULL-STACK

---

**TRƯỜNG:** ....................................................

**KHOA:** ......................................................

**Sinh viên thực hiện:** ..........................................

**Mã sinh viên:** ...............................................

**Lớp:** .......................................................

**Giảng viên hướng dẫn:** .......................................

**Năm học:** 2025 - 2026

---

# MỤC LỤC

1. Giới thiệu đề tài
2. Lý do chọn đề tài
3. Mục tiêu hệ thống
4. Phạm vi hệ thống
5. Công nghệ sử dụng
6. Phân tích yêu cầu hệ thống
   6.1. Yêu cầu chức năng
   6.2. Yêu cầu phi chức năng
7. Phân quyền người dùng
8. Sơ đồ Use Case
9. Đặc tả Use Case
10. Thiết kế cơ sở dữ liệu
11. Thiết kế API
12. Thiết kế giao diện
13. Bảo mật hệ thống
14. Kiểm thử hệ thống
15. Hướng phát triển
16. Kết luận

---

# 1. GIỚI THIỆU ĐỀ TÀI

Trong quá trình phát triển các hệ thống phần mềm hiện đại, các chức năng như xác thực người dùng, quản lý tài khoản, phân quyền, upload file, gửi email, thông báo trong hệ thống, ghi log hoạt động và dashboard quản trị là những thành phần nền tảng xuất hiện trong hầu hết các ứng dụng thực tế.

Đề tài "Xây dựng hệ thống lõi xác thực, quản lý người dùng và quản trị hệ thống Full-stack" được thực hiện nhằm xây dựng một bộ khung hệ thống hoàn chỉnh bao gồm cả Backend và Frontend. Hệ thống này không tập trung vào một nghiệp vụ cụ thể như bán hàng, đặt lịch hay học trực tuyến, mà tập trung xây dựng các module nền tảng có thể tái sử dụng trong nhiều loại đồ án lớn khác nhau.

Hệ thống được xây dựng với Backend sử dụng Node.js, Express.js, Prisma ORM, SQL Database, JWT, OAuth, Nodemailer và Multer. Phía Frontend sử dụng React, Vite, Tailwind CSS, React Router và Axios. Người dùng có thể đăng ký, xác thực email, đăng nhập, quản lý hồ sơ cá nhân, upload avatar, xem thông báo và đổi mật khẩu. Quản trị viên có thể quản lý người dùng, khóa/mở khóa tài khoản, gửi thông báo, xem nhật ký hoạt động và theo dõi thống kê hệ thống thông qua dashboard.

Đề tài giúp sinh viên rèn luyện khả năng phân tích, thiết kế và xây dựng một hệ thống Full-stack có tính ứng dụng cao, đồng thời tạo nền tảng để phát triển tiếp thành các hệ thống lớn hơn trong tương lai.

---

# 2. LÝ DO CHỌN ĐỀ TÀI

Hiện nay, hầu hết các hệ thống phần mềm đều cần có các chức năng nền tảng như đăng ký, đăng nhập, phân quyền người dùng, quản lý tài khoản, gửi email xác thực, quên mật khẩu, upload file và quản trị hệ thống. Nếu mỗi lần xây dựng một đồ án mới đều phải làm lại toàn bộ các chức năng này từ đầu thì sẽ mất nhiều thời gian và dễ phát sinh lỗi.

Vì vậy, việc xây dựng một hệ thống lõi có thể tái sử dụng là rất cần thiết. Hệ thống này có thể đóng vai trò là nền tảng ban đầu cho nhiều đồ án lớn như hệ thống bán hàng, hệ thống đặt lịch khám, hệ thống học trực tuyến, hệ thống quản lý sinh viên hoặc hệ thống quản lý công việc.

Bên cạnh đó, đề tài còn giúp người thực hiện hiểu rõ hơn về các vấn đề quan trọng trong phát triển phần mềm thực tế như bảo mật tài khoản, xác thực bằng JWT, OAuth, quản lý refresh token, phân quyền người dùng, gửi email tự động, upload file, ghi log hoạt động và xây dựng giao diện quản trị.

Việc chọn đề tài này giúp sinh viên không chỉ hoàn thành một hệ thống có thể chạy được, mà còn có được một bộ khung kỹ thuật vững chắc để tiếp tục mở rộng thành các sản phẩm phần mềm hoàn chỉnh hơn trong tương lai.

---

# 3. MỤC TIÊU HỆ THỐNG

Mục tiêu của hệ thống là xây dựng một nền tảng Full-stack hoàn chỉnh phục vụ cho việc xác thực, quản lý người dùng và quản trị hệ thống.

Các mục tiêu cụ thể bao gồm:

- Xây dựng chức năng đăng ký, đăng nhập và đăng xuất người dùng.
- Sử dụng JWT để xác thực và bảo vệ các API.
- Xây dựng cơ chế refresh token để duy trì phiên đăng nhập.
- Hỗ trợ đăng nhập bằng Google và Facebook thông qua OAuth.
- Xây dựng chức năng xác thực email sau khi đăng ký.
- Xây dựng chức năng quên mật khẩu và đặt lại mật khẩu qua email.
- Xây dựng chức năng quản lý hồ sơ cá nhân.
- Hỗ trợ upload, cập nhật và xóa avatar người dùng.
- Xây dựng module upload file dùng chung cho hệ thống.
- Xây dựng hệ thống email template để gửi email tự động.
- Xây dựng hệ thống thông báo trong ứng dụng.
- Xây dựng module ghi log hoạt động người dùng và quản trị viên.
- Xây dựng dashboard thống kê dành cho quản trị viên.
- Xây dựng giao diện Frontend thân thiện, dễ sử dụng.
- Phân quyền rõ ràng giữa người dùng thường và quản trị viên.
- Tạo nền tảng có thể mở rộng thành các đồ án lớn khác.

---

# 4. PHẠM VI HỆ THỐNG

Hệ thống tập trung xây dựng các chức năng lõi phục vụ cho việc quản lý người dùng và quản trị hệ thống. Phạm vi của đề tài bao gồm các chức năng chính sau:

### Đối với người dùng thường

Người dùng thường có thể:

- Đăng ký tài khoản.
- Xác thực email.
- Đăng nhập vào hệ thống.
- Đăng xuất khỏi hệ thống.
- Xem thông tin tài khoản cá nhân.
- Cập nhật thông tin cá nhân.
- Upload và xóa avatar.
- Đổi mật khẩu.
- Sử dụng chức năng quên mật khẩu.
- Xem danh sách thông báo.
- Đánh dấu thông báo đã đọc.
- Upload và quản lý file của chính mình.

### Đối với quản trị viên

Quản trị viên có thể:

- Đăng nhập vào hệ thống quản trị.
- Xem dashboard thống kê tổng quan.
- Xem danh sách người dùng.
- Tìm kiếm, lọc và phân trang danh sách người dùng.
- Đổi role người dùng.
- Khóa hoặc mở khóa tài khoản người dùng.
- Quản lý file upload của toàn bộ hệ thống.
- Gửi thông báo cho một người dùng.
- Gửi thông báo hàng loạt.
- Xem danh sách activity log.
- Tìm kiếm, lọc và xem chi tiết activity log.
- Theo dõi các hoạt động quan trọng của hệ thống.

### Ngoài phạm vi hiện tại

Đề tài hiện tại chưa tập trung vào một nghiệp vụ cụ thể như bán hàng, đặt lịch khám hay học trực tuyến. Các chức năng như quản lý sản phẩm, giỏ hàng, đơn hàng, thanh toán, lịch hẹn, khóa học hoặc bài kiểm tra sẽ được xem là hướng phát triển tiếp theo khi lựa chọn đề tài lớn cụ thể.

Hệ thống hiện tại đóng vai trò là nền tảng lõi để có thể tích hợp thêm các module nghiệp vụ trong tương lai.

---

# 5. CÔNG NGHỆ SỬ DỤNG

*(Nội dung sẽ được điền sau)*

---

# 6. PHÂN TÍCH YÊU CẦU HỆ THỐNG

## 6.1. Yêu cầu chức năng

*(Nội dung sẽ được điền sau)*

## 6.2. Yêu cầu phi chức năng

*(Nội dung sẽ được điền sau)*

---

# 7. PHÂN QUYỀN NGƯỜI DÙNG

*(Nội dung sẽ được điền sau)*

---

# 8. SƠ ĐỒ USE CASE

*(Nội dung sẽ được điền sau)*

---

# 9. ĐẶC TẢ USE CASE

*(Nội dung sẽ được điền sau)*

---

# 10. THIẾT KẾ CƠ SỞ DỮ LIỆU

*(Nội dung sẽ được điền sau)*

---

# 11. THIẾT KẾ API

*(Nội dung sẽ được điền sau)*

---

# 12. THIẾT KẾ GIAO DIỆN

*(Nội dung sẽ được điền sau)*

---

# 13. BẢO MẬT HỆ THỐNG

*(Nội dung sẽ được điền sau)*

---

# 14. KIỂM THỬ HỆ THỐNG

*(Nội dung sẽ được điền sau)*

---

# 15. HƯỚNG PHÁT TRIỂN

*(Nội dung sẽ được điền sau)*

---

# 16. KẾT LUẬN

*(Nội dung sẽ được điền sau)*
