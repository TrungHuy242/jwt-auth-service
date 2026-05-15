import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resendVerificationSchema } from "../validations/authSchemas";
import { FormError, AppBrand, MaintenanceBanner } from "../components/ui";
import { authApi } from "../api/authApi";
import { useToast } from "../context/ToastContext";
import { getErrorMessage, getSuccessMessage } from "../utils/toastMessage";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token xác thực không hợp lệ hoặc đã hết hạn");
      return;
    }

    const verify = async () => {
      try {
        const response = await authApi.verifyEmail(token);
        const msg = getSuccessMessage(
          response,
          "Xác thực email thành công. Bạn có thể đăng nhập."
        );
        setStatus("success");
        setMessage(msg);
        toast.success(msg);
      } catch (error) {
        const msg = getErrorMessage(
          error,
          "Xác thực email thất bại. Token có thể đã hết hạn."
        );
        setStatus("error");
        setMessage(msg);
        toast.error(msg);
      }
    };

    verify();
  }, [token]);

  const handleResend = async (data) => {
    try {
      setResendLoading(true);
      setResendError("");
      setResendMessage("");

      const response = await authApi.resendVerificationEmail(data.email);

      const msg = getSuccessMessage(
        response,
        "Nếu email tồn tại và chưa xác thực, hệ thống sẽ gửi lại email xác thực"
      );

      setResendMessage(msg);
      toast.success(msg);

      reset();
    } catch (error) {
      const msg = getErrorMessage(
        error,
        "Gửi lại email xác thực thất bại"
      );

      setResendError(msg);
      toast.error(msg);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <AppBrand size="lg" showSubtitle />
          </div>

          <MaintenanceBanner />

          {status === "loading" && (
            <div className="text-center">
              <Loader2 size={48} className="mx-auto mb-4 animate-spin text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">Đang xác thực...</h2>
              <p className="mt-2 text-sm text-slate-500">
                Vui lòng chờ trong giây lát
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold text-slate-900">Xác thực thành công!</h2>
              <p className="mt-2 text-sm text-slate-500">{message}</p>
              <Link
                to="/login"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Đăng nhập ngay
              </Link>
            </div>
          )}

          {status === "error" && (
            <div>
              <div className="text-center">
                <XCircle size={48} className="mx-auto mb-4 text-red-600" />
                <h2 className="text-2xl font-bold text-slate-900">Xác thực thất bại</h2>
                <p className="mt-2 text-sm text-slate-500">{message}</p>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-6 text-left">
                <p className="mb-3 text-sm font-medium text-slate-700">
                  Gửi lại email xác thực
                </p>

                {resendError && (
                  <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    {resendError}
                  </div>
                )}

                {resendMessage && (
                  <div className="mb-3 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
                    {resendMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit(handleResend)} className="space-y-3">
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="Nhập email của bạn"
                      disabled={resendLoading}
                      className={`w-full rounded-xl border py-3 pl-12 pr-4 outline-none focus:ring-2 ${
                        errors.email
                          ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                    />
                  </div>
                  <FormError message={errors.email?.message} />

                  <button
                    type="submit"
                    disabled={resendLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resendLoading ? "Đang gửi..." : "Gửi lại email xác thực"}
                  </button>
                </form>

                <div className="mt-4 flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    Quay lại đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft size={16} />
                    Đăng ký tài khoản mới
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
