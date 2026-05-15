import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { authApi } from "../api/authApi";
import { useToast } from "../context/ToastContext";
import { getErrorMessage, getSuccessMessage } from "../utils/toastMessage";

function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập email" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });
      const response = await authApi.forgotPassword(email);
      const msg = getSuccessMessage(response, "Nếu email tồn tại, hệ thống sẽ gửi hướng dẫn đặt lại mật khẩu");
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
            <h1 className="text-2xl font-bold text-slate-900">Quên mật khẩu?</h1>
            <p className="mt-2 text-sm text-slate-500">
              Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
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

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Nhập email của bạn"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
