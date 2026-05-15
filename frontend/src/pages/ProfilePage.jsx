import { useEffect, useState } from "react";
import { Camera, Save, Trash2, UserCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userApi } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmContext";
import { ProfileSkeleton, FormError } from "../components/ui";
import { getErrorMessage, getSuccessMessage } from "../utils/toastMessage";
import { confirmPresets } from "../utils/confirmPresets";
import { profileSchema } from "../validations/profileSchemas";

function ProfilePage() {
  const { user, setUser, loadCurrentUser } = useAuth();
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState("");

  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });

      setPreviewAvatar(user.avatar || "");
    }
  }, [user, reset]);

  const handleUpdateProfile = async (data) => {
    try {
      setProfileLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await userApi.updateMyProfile({
        name: data.name,
        phone: data.phone || "",
        address: data.address || "",
      });

      const message = getSuccessMessage(response, "Cập nhật hồ sơ thành công");

      setUser(response.user);
      setSuccessMessage(message);
      toast.success(message);
    } catch (error) {
      const message = getErrorMessage(error, "Cập nhật hồ sơ thất bại");
      setError(message);
      toast.error(message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAvatarFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
    setError("");
    setSuccessMessage("");
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      setError("Vui lòng chọn ảnh avatar");
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append("avatar", avatarFile);

    try {
      setAvatarLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await userApi.updateAvatar(formDataUpload);

      const message = getSuccessMessage(response, "Cập nhật avatar thành công");
      setUser(response.user);
      setAvatarFile(null);
      setPreviewAvatar(response.user.avatar || "");
      setSuccessMessage(message);
      toast.success(message);
    } catch (error) {
      const message = getErrorMessage(error, "Upload avatar thất bại");
      setError(message);
      toast.error(message);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    const ok = await confirm(
      confirmPresets.delete({
        title: "Xóa avatar",
        message:
          "Bạn có chắc muốn xóa avatar hiện tại không? Sau khi xóa, ảnh đại diện sẽ bị gỡ khỏi tài khoản.",
        confirmText: "Xóa avatar",
      })
    );

    if (!ok) {
      return;
    }

    try {
      setAvatarLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await userApi.deleteAvatar();

      const message = getSuccessMessage(response, "Xóa avatar thành công");

      setUser(response.user);
      setAvatarFile(null);
      setPreviewAvatar("");
      setSuccessMessage(message);
      toast.success(message);
    } catch (error) {
      const message = getErrorMessage(error, "Xóa avatar thất bại");
      setError(message);
      toast.error(message);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleReloadProfile = async () => {
    try {
      setProfileLoading(true);
      await loadCurrentUser();
      setSuccessMessage("Tải lại thông tin thành công");
      toast.success("Tải lại thông tin thành công");
    } catch (error) {
      const message = "Không thể tải lại thông tin user";
      setError(message);
      toast.error(message);
    } finally {
      setProfileLoading(false);
    }
  };

  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Hồ sơ cá nhân
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý thông tin tài khoản của bạn
          </p>
        </div>

        <button
          onClick={handleReloadProfile}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
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

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-slate-200 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {previewAvatar ? (
                <img
                  src={previewAvatar}
                  alt="Avatar"
                  className="h-32 w-32 rounded-full object-cover ring-4 ring-slate-100"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-100 text-slate-400 ring-4 ring-slate-100">
                  <UserCircle size={80} />
                </div>
              )}

              <label className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow hover:bg-blue-700">
                <Camera size={18} />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              {user?.name}
            </h2>
            <p className="text-sm text-slate-500">{user?.email}</p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {user?.role}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  user?.status === "ACTIVE"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {user?.status}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  user?.isVerified
                    ? "bg-green-50 text-green-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {user?.isVerified ? "Verified" : "Unverified"}
              </span>
            </div>

            <div className="mt-6 grid w-full gap-3">
              <button
                onClick={handleUploadAvatar}
                disabled={avatarLoading || !avatarFile}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {avatarLoading ? "Đang lưu..." : "Lưu avatar"}
              </button>

              <button
                onClick={handleDeleteAvatar}
                disabled={avatarLoading || !user?.avatar}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 size={18} />
                Xóa avatar
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Thông tin cá nhân
          </h2>

          <form onSubmit={handleSubmit(handleUpdateProfile)} className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Họ tên
              </label>
              <input
                type="text"
                {...register("name")}
                className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
                placeholder="Nhập họ tên"
              />
              <FormError message={errors.name?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Số điện thoại
              </label>
              <input
                type="text"
                {...register("phone")}
                className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 ${
                  errors.phone
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
                placeholder="Nhập số điện thoại"
              />
              <FormError message={errors.phone?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Địa chỉ
              </label>
              <textarea
                {...register("address")}
                rows={4}
                className={`w-full resize-none rounded-xl border px-4 py-3 outline-none focus:ring-2 ${
                  errors.address
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
                placeholder="Nhập địa chỉ"
              />
              <FormError message={errors.address?.message} />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />
              {profileLoading ? "Đang lưu..." : "Lưu thông tin"}
            </button>
          </form>

          <div className="mt-8 grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 md:grid-cols-2">
            <div>
              <span className="font-medium text-slate-800">Provider:</span>{" "}
              {user?.provider}
            </div>

            <div>
              <span className="font-medium text-slate-800">Last login:</span>{" "}
              {user?.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString("vi-VN")
                : "Chưa có"}
            </div>

            <div>
              <span className="font-medium text-slate-800">Created:</span>{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleString("vi-VN")
                : ""}
            </div>

            <div>
              <span className="font-medium text-slate-800">Updated:</span>{" "}
              {user?.updatedAt
                ? new Date(user.updatedAt).toLocaleString("vi-VN")
                : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
