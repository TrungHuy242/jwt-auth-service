import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { authApi } from "../api/authApi";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token xác thực không hợp lệ hoặc đã hết hạn");
      return;
    }

    const verify = async () => {
      try {
        const response = await authApi.verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Xác thực email thành công. Bạn có thể đăng nhập.");
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Xác thực email thất bại. Token có thể đã hết hạn.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center">
          {status === "loading" && (
            <>
              <Loader2 size={48} className="mx-auto mb-4 animate-spin text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">Đang xác thực...</h1>
              <p className="mt-2 text-sm text-slate-500">
                Vui lòng chờ trong giây lát
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle size={48} className="mx-auto mb-4 text-green-600" />
              <h1 className="text-2xl font-bold text-slate-900">Xác thực thành công!</h1>
              <p className="mt-2 text-sm text-slate-500">{message}</p>
              <Link
                to="/login"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Đăng nhập ngay
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle size={48} className="mx-auto mb-4 text-red-600" />
              <h1 className="text-2xl font-bold text-slate-900">Xác thực thất bại</h1>
              <p className="mt-2 text-sm text-slate-500">{message}</p>
              <div className="mt-6 flex flex-col gap-3">
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
                  Đăng ký tài khoản mới
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
