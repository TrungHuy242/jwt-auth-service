import { useEffect, useState } from "react";
import { Bell, CheckCheck, RefreshCcw } from "lucide-react";
import { notificationApi } from "../api/notificationApi";
import { useToast } from "../context/ToastContext";
import { getErrorMessage, getSuccessMessage } from "../utils/toastMessage";

const notificationTypes = [
  "",
  "SYSTEM",
  "SECURITY",
  "ACCOUNT",
  "ORDER",
  "APPOINTMENT",
  "COURSE",
  "OTHER",
];

function NotificationsPage() {
  const { toast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalNotifications: 0,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    isRead: "",
    type: "",
  });

  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: pagination.limit,
      };

      if (filters.isRead !== "") {
        params.isRead = filters.isRead;
      }

      if (filters.type) {
        params.type = filters.type;
      }

      const response = await notificationApi.getNotifications(params);

      setNotifications(response.notifications || []);
      setPagination(response.pagination);
    } catch (error) {
      const message = getErrorMessage(error, "Không thể tải danh sách thông báo");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
    fetchUnreadCount();
  }, [filters.isRead, filters.type]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccessMessage("");
    setError("");
  };

  const handleMarkAsRead = async (id) => {
    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await notificationApi.markAsRead(id);

      const message = getSuccessMessage(response, "Đánh dấu thông báo đã đọc");
      setSuccessMessage(message);
      toast.success(message);
      await fetchNotifications(pagination.page);
      await fetchUnreadCount();
    } catch (error) {
      const message = getErrorMessage(error, "Không thể đánh dấu thông báo");
      setError(message);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await notificationApi.markAllAsRead();

      const message = `${getSuccessMessage(response, "Đánh dấu tất cả đã đọc")} (${response.updatedCount || 0})`;
      setSuccessMessage(message);
      toast.success(message);
      await fetchNotifications(pagination.page);
      await fetchUnreadCount();
    } catch (error) {
      const message = getErrorMessage(error, "Không thể đánh dấu tất cả thông báo");
      setError(message);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchNotifications(pagination.page);
    await fetchUnreadCount();
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case "SYSTEM":
        return "bg-blue-50 text-blue-700";
      case "SECURITY":
        return "bg-red-50 text-red-700";
      case "ACCOUNT":
        return "bg-purple-50 text-purple-700";
      case "ORDER":
        return "bg-green-50 text-green-700";
      case "APPOINTMENT":
        return "bg-yellow-50 text-yellow-700";
      case "COURSE":
        return "bg-indigo-50 text-indigo-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Bell className="text-blue-600" />
            Thông báo
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Bạn có {unreadCount} thông báo chưa đọc
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCcw size={16} />
            Tải lại
          </button>

          <button
            onClick={handleMarkAllAsRead}
            disabled={actionLoading || unreadCount === 0}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckCheck size={16} />
            Đánh dấu tất cả đã đọc
          </button>
        </div>
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

      <div className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Trạng thái
          </label>

          <select
            name="isRead"
            value={filters.isRead}
            onChange={handleFilterChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Tất cả</option>
            <option value="false">Chưa đọc</option>
            <option value="true">Đã đọc</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Loại thông báo
          </label>

          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {notificationTypes.map((type) => (
              <option key={type || "ALL"} value={type}>
                {type || "Tất cả"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          Đang tải thông báo...
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          Không có thông báo nào.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-2xl border p-5 ${
                notification.isRead
                  ? "border-slate-200 bg-white"
                  : "border-blue-200 bg-blue-50/40"
              }`}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">
                      {notification.title}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getTypeBadgeClass(
                        notification.type
                      )}`}
                    >
                      {notification.type}
                    </span>

                    {!notification.isRead && (
                      <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                        Mới
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {notification.message}
                  </p>

                  {notification.link && (
                    <p className="mt-2 text-xs text-blue-600">
                      Link: {notification.link}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(notification.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>

                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    disabled={actionLoading}
                    className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-60"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Trang {pagination.page} / {pagination.totalPages || 1} - Tổng{" "}
          {pagination.totalNotifications || 0} thông báo
        </p>

        <div className="flex gap-2">
          <button
            disabled={pagination.page <= 1 || loading}
            onClick={() => fetchNotifications(pagination.page - 1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trước
          </button>

          <button
            disabled={
              pagination.page >= pagination.totalPages || loading
            }
            onClick={() => fetchNotifications(pagination.page + 1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
