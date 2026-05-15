import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { authApi } from "../api/authApi";
import { useToast } from "../context/ToastContext";
import { getErrorMessage, getSuccessMessage } from "../utils/toastMessage";

function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Vui lòng nhập họ tên");
      return;
    }

    if (!formData.email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!formData.password) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    if (formData.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError("Mật khẩu phải chứa ít nhất 1 chữ hoa");
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      setError("Mật khẩu phải chứa ít nhất 1 chữ thường");
      return;
    }

    if (!/\d/.test(formData.password)) {
      setError("Mật khẩu phải chứa ít nhất 1 số");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError("Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const message = getSuccessMessage(
        response,
        "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản."
      );
      setSuccessMessage(message);
      toast.success(message);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const message = getErrorMessage(error, "Đăng ký thất bại");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Đăng ký</h1>
            <p className="mt-2 text-sm text-slate-500">
              Tạo tài khoản mới để bắt đầu
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Họ tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Nhập họ tên của bạn"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Nhập email của bạn"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Ít nhất 8 ký tự, 1 hoa, 1 thường, 1 số, 1 đặc biệt"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Xác nhận mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Nhập lại mật khẩu"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserPlus size={18} />
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
