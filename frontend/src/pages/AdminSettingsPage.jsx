import { useEffect, useState } from "react";
import { Save, Settings, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingApi } from "../api/settingApi";
import { FormError, PageSkeleton } from "../components/ui";
import { useToast } from "../context/ToastContext";
import { useSettings } from "../context/SettingsContext";
import { adminSettingsSchema } from "../validations";
import { getErrorMessage, getSuccessMessage } from "../utils/toastMessage";

function AdminSettingsPage() {
  const { toast } = useToast();
  const { setSettings, loadPublicSettings } = useSettings();

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminSettingsSchema),
    defaultValues: {
      siteName: "",
      siteLogo: "",
      systemEmail: "",
      supportEmail: "",
      footerText: "",
      allowRegister: true,
      allowGoogleLogin: true,
      allowFacebookLogin: true,
      maintenanceMode: false,
      maxUploadSizeMB: 10,
      defaultUserRole: "USER",
    },
  });

  const siteLogo = watch("siteLogo");
  const siteName = watch("siteName");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await settingApi.getAdminSettings();
      const settings = response.settings;

      reset({
        siteName: settings.siteName || "",
        siteLogo: settings.siteLogo || "",
        systemEmail: settings.systemEmail || "",
        supportEmail: settings.supportEmail || "",
        footerText: settings.footerText || "",
        allowRegister: Boolean(settings.allowRegister),
        allowGoogleLogin: Boolean(settings.allowGoogleLogin),
        allowFacebookLogin: Boolean(settings.allowFacebookLogin),
        maintenanceMode: Boolean(settings.maintenanceMode),
        maxUploadSizeMB: settings.maxUploadSizeMB || 10,
        defaultUserRole: settings.defaultUserRole || "USER",
      });
    } catch (error) {
      const message = getErrorMessage(error, "Không thể tải cấu hình hệ thống");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const onSubmit = async (data) => {
    try {
      setSaveLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await settingApi.updateAdminSettings(data);

      const message = getSuccessMessage(
        response,
        "Cập nhật cấu hình hệ thống thành công"
      );

      setSuccessMessage(message);
      toast.success(message);

      if (response.settings) {
        setSettings((prev) => ({
          ...prev,
          ...response.settings,
        }));
      }

      await loadPublicSettings();
    } catch (error) {
      const message = getErrorMessage(error, "Cập nhật cấu hình thất bại");
      setError(message);
      toast.error(message);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Settings className="text-blue-600" />
            Cấu hình hệ thống
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý tên hệ thống, đăng ký, đăng nhập mạng xã hội và trạng thái bảo trì
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSettings}
          disabled={loading || saveLoading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCcw size={16} />
          Tải lại
        </button>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Thông tin hệ thống
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Tên hệ thống
                  </label>
                  <input
                    type="text"
                    {...register("siteName")}
                    className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 ${
                      errors.siteName
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                    placeholder="VD: Universal Full-stack Admin Starter"
                  />
                  <FormError message={errors.siteName?.message} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    {...register("siteLogo")}
                    className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 ${
                      errors.siteLogo
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                    placeholder="https://..."
                  />
                  <FormError message={errors.siteLogo?.message} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email hệ thống
                  </label>
                  <input
                    type="email"
                    {...register("systemEmail")}
                    className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 ${
                      errors.systemEmail
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                    placeholder="system@example.com"
                  />
                  <FormError message={errors.systemEmail?.message} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email hỗ trợ
                  </label>
                  <input
                    type="email"
                    {...register("supportEmail")}
                    className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 ${
                      errors.supportEmail
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                    placeholder="support@example.com"
                  />
                  <FormError message={errors.supportEmail?.message} />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Footer text
                  </label>
                  <input
                    type="text"
                    {...register("footerText")}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="\u00a9 2026 Universal Starter"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Tài khoản & đăng nhập
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <ToggleItem
                  label="Cho phép đăng ký tài khoản"
                  description="Nếu tắt, user mới không thể tự đăng ký."
                  register={register("allowRegister")}
                />

                <ToggleItem
                  label="Cho phép Google Login"
                  description="Hiển thị và cho phép đăng nhập bằng Google."
                  register={register("allowGoogleLogin")}
                />

                <ToggleItem
                  label="Cho phép Facebook Login"
                  description="Hiển thị và cho phép đăng nhập bằng Facebook."
                  register={register("allowFacebookLogin")}
                />

                <ToggleItem
                  label="Maintenance Mode"
                  description="Bật chế độ bảo trì cho hệ thống."
                  register={register("maintenanceMode")}
                  danger
                />

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Role mặc định khi đăng ký
                  </label>
                  <select
                    {...register("defaultUserRole")}
                    className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 ${
                      errors.defaultUserRole
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <FormError message={errors.defaultUserRole?.message} />
                  <p className="mt-2 text-xs text-yellow-600">
                    Khuyến nghị để USER, không nên để ADMIN trong môi trường thật.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Dung lượng upload tối đa (MB)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    {...register("maxUploadSizeMB")}
                    className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 ${
                      errors.maxUploadSizeMB
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  <FormError message={errors.maxUploadSizeMB?.message} />
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Preview
              </h2>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  {siteLogo ? (
                    <img
                      src={siteLogo}
                      alt={siteName}
                      className="h-12 w-12 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">
                      {siteName?.charAt(0)?.toUpperCase() || "F"}
                    </div>
                  )}

                  <div>
                    <p className="font-bold text-slate-900">
                      {siteName || "Tên hệ thống"}
                    </p>
                    <p className="text-xs text-slate-500">
                      System Settings Preview
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Lưu cấu hình
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sau khi lưu, cấu hình public sẽ được cập nhật và frontend có thể sử dụng ngay.
              </p>

              <button
                type="submit"
                disabled={saveLoading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {saveLoading ? "Đang lưu..." : "Lưu cấu hình"}
              </button>
            </section>
          </aside>
        </div>
      </form>
    </div>
  );
}

function ToggleItem({ label, description, register, danger = false }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${
        danger
          ? "border-red-100 bg-red-50/40"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <input
        type="checkbox"
        {...register}
        className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />

      <span>
        <span className="block text-sm font-semibold text-slate-800">
          {label}
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>
    </label>
  );
}

export default AdminSettingsPage;
