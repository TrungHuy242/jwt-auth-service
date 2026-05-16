import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { notificationApi } from "../api/notificationApi";
import { useToast } from "../context/ToastContext";
import { useNotification } from "../context/NotificationContext";
import { getErrorMessage } from "../utils/toastMessage";

function NotificationDropdown() {
  const { toast } = useToast();
  const {
    unreadCount,
    loadUnreadCount,
    decreaseUnreadCount,
    resetUnreadCount,
  } = useNotification();

  const dropdownRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLatestNotifications = async () => {
    try {
      setLoading(true);

      const response = await notificationApi.getNotifications({
        page: 1,
        limit: 5,
      });

      setNotifications(response.notifications || []);
    } catch (error) {
      const message = getErrorMessage(error, "Khong the tai thong bao");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (nextOpen) {
      await Promise.all([fetchLatestNotifications(), loadUnreadCount()]);
    }
  };

  const handleMarkAsRead = async (notification) => {
    if (notification.isRead) {
      return;
    }

    try {
      setActionLoading(true);

      await notificationApi.markAsRead(notification.id);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item
        )
      );

      decreaseUnreadCount(1);
    } catch (error) {
      const message = getErrorMessage(error, "Khong the danh dau da doc");
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading(true);

      await notificationApi.markAllAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      resetUnreadCount();
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Khong the danh dau tat ca da doc"
      );
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getNotificationTypeClass = (type) => {
    switch (type) {
      case "SYSTEM":
        return "bg-blue-50 text-blue-700";
      case "SECURITY":
        return "bg-red-50 text-red-700";
      case "ACCOUNT":
        return "bg-green-50 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        aria-label="Thong bao"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h3 className="font-bold text-slate-900">Thong bao</h3>
              <p className="text-xs text-slate-500">
                {unreadCount > 0
                  ? `${unreadCount} thong bao chua doc`
                  : "Khong co thong bao chua doc"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={actionLoading || unreadCount === 0}
              className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck size={14} />
              Doc het
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-2xl border border-slate-100 p-4"
                  >
                    <div className="h-4 w-40 rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-full rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-3/4 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                Chua co thong bao nao.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleMarkAsRead(notification)}
                    className={`block w-full px-4 py-3 text-left hover:bg-slate-50 ${
                      notification.isRead ? "bg-white" : "bg-blue-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-semibold text-slate-900">
                            {notification.title}
                          </p>

                          {!notification.isRead && (
                            <span className="h-2 w-2 rounded-full bg-blue-600" />
                          )}
                        </div>

                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">
                          {notification.message}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${getNotificationTypeClass(
                              notification.type
                            )}`}
                          >
                            {notification.type || "SYSTEM"}
                          </span>

                          <span className="text-xs text-slate-400">
                            {notification.createdAt
                              ? new Date(
                                  notification.createdAt
                                ).toLocaleString("vi-VN")
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-3">
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Xem tat ca thong bao
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;
