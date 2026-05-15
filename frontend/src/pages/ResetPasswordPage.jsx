import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, KeyRound, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../validations/authSchemas";
import { FormError, AppBrand, MaintenanceBanner } from "../components/ui";
import { authApi } from "../api/authApi";
import { useToast } from "../context/ToastContext";
import { getErrorMessage, getSuccessMessage } from "../utils/toastMessage";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      const msg = "Token không hợp lệ hoặc đã hết hạn";
      setMessage({ type: "error", text: msg });
      toast.warning(msg);
    }
  }, [token]);

  const onSubmit = async (data) => {
    if (!token) {
      const message = "Thiếu token đặt lại mật khẩu";
      setMessage({ type: "error", text: message });
      toast.warning(message);
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const response = await authApi.resetPassword({
        resetToken: token,
        newPassword: data.newPassword,
      });

      const msg = getSuccessMessage(
        response,
        "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại."
      );

      setSuccess(true);
      setMessage({ type: "success", text: msg });
      toast.success(msg);

      reset();
    } catch (error) {
      const msg = getErrorMessage(error, "Đặt lại mật khẩu thất bại");

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
            <AppBrand size="lg" showSubtitle />
          </div>

          <MaintenanceBanner />

          <h1 className="text-2xl font-bold text-slate-900">Đặt lại mật khẩu</h1>
          <p className="mt-2 text-sm text-slate-500">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>

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
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
                    {...register("newPassword")}
                    placeholder="Nhập mật khẩu mới"
                    disabled={loading || !token}
                    className={`w-full rounded-xl border py-3 pl-12 pr-12 outline-none focus:ring-2 ${
                      errors.newPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <FormError message={errors.newPassword?.message} />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={loading || !token}
                  className={`w-full rounded-xl border py-3 px-4 outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />
                <FormError message={errors.confirmPassword?.message} />
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
