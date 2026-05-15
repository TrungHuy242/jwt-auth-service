import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, KeyRound, ArrowLeft } from "lucide-react";
import { authApi } from "../api/authApi";
import { useToast } from "../context/ToastContext";
import { getErrorMessage, getSuccessMessage } from "../utils/toastMessage";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      const msg = "Token không hợp lệ hoặc đã hết hạn";
      setMessage({ type: "error", text: msg });
      toast.warning(msg);
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      const msg = "Token không hợp lệ hoặc đã hết hạn";
      setMessage({ type: "error", text: msg });
      toast.warning(msg);
      return;
    }

    if (!password) {
      const msg = "Vui lòng nhập mật khẩu mới";
      setMessage({ type: "error", text: msg });
      toast.warning(msg);
      return;
    }

    if (password.length < 8) {
      const msg = "Mật khẩu phải có ít nhất 8 ký tự";
      setMessage({ type: "error", text: msg });
      toast.warning(msg);
      return;
    }

    if (!/[A-Z]/.test(password)) {
      const msg = "Mật khẩu phải chứa ít nhất 1 chữ hoa";
      setMessage({ type: "error", text: msg });
      toast.warning(msg);
      return;
    }

    if (!/[a-z]/.test(password)) {
      const msg = "Mật khẩu phải chứa ít nhất 1 chữ thường";
      setMessage({ type: "error", text: msg });
      toast.warning(msg);
      return;
    }

    if (!/\d/.test(password)) {
      const msg = "Mật khẩu phải chứa ít nhất 1 số";
      setMessage({ type: "error", text: msg });
      toast.warning(msg);
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      const msg = "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt";
      setMessage({ type: "error", text: msg });
      toast.warning(msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = "Mật khẩu xác nhận không khớp";
      setMessage({ type: "error", text: msg });
      toast.warning(msg);
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });
      const response = await authApi.resetPassword({ resetToken: token, newPassword: password });
      const msg = getSuccessMessage(response, "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.");
      setSuccess(true);
      setMessage({ type: "success", text: msg });
      toast.success(msg);
    } catch (error) {
      const msg = getErrorMessage(error, "Có lỗi xảy ra. Vui lòng thử lại.");
      setMessage({ type: "error", text: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <Link
              to="/login"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft size={16} />
              Quay lại đăng nhập
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Đặt lại mật khẩu</h1>
            <p className="mt-2 text-sm text-slate-500">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          {message.text && (
            <div
              className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
                message.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <KeyRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Ít nhất 8 ký tự, 1 hoa, 1 thường, 1 số, 1 đặc biệt"
                    disabled={loading || !token}
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
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={loading || !token}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </button>
            </form>
          )}

          {success && (
            <Link
              to="/login"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Đăng nhập ngay
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
