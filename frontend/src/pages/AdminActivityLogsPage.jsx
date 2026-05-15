import { useEffect, useState } from "react";
import { Activity, Eye, RefreshCcw, Search, X } from "lucide-react";
import { adminApi } from "../api/adminApi";
import { useToast } from "../context/ToastContext";
import { getErrorMessage, getSuccessMessage } from "../utils/toastMessage";

const actionOptions = [
  "",
  "LOGIN",
  "LOGOUT",
  "CHANGE_PASSWORD",
  "RESET_PASSWORD",
  "UPLOAD_FILE",
  "UPLOAD_MULTIPLE_FILES",
  "DELETE_FILE",
  "UPDATE_USER_ROLE",
  "UPDATE_USER_STATUS",
  "SEND_NOTIFICATION_TO_USER",
  "BROADCAST_NOTIFICATION",
];

const methodOptions = ["", "GET", "POST", "PATCH", "PUT", "DELETE"];

function AdminActivityLogsPage() {
  const { toast } = useToast();

  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalLogs: 0,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    search: "",
    userId: "",
    action: "",
    method: "",
  });

  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: pagination.limit,
      };

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.userId) {
        params.userId = filters.userId;
      }

      if (filters.action) {
        params.action = filters.action;
      }

      if (filters.method) {
        params.method = filters.method;
      }

      const response = await adminApi.getActivityLogs(params);

      setLogs(response.logs || []);
      setPagination(response.pagination);
    } catch (error) {
      const message = getErrorMessage(error, "Không thể tải activity logs");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, [filters.action, filters.method]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchLogs(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      userId: "",
      action: "",
      method: "",
    });
  };

  const handleViewDetail = async (id) => {
    try {
      setDetailLoading(true);
      setError("");

      const response = await adminApi.getActivityLogById(id);

      setSelectedLog(response.log);
      toast.info("Đã tải chi tiết activity log");
    } catch (error) {
      const message = getErrorMessage(error, "Không thể lấy chi tiết activity log");
      setError(message);
      toast.error(message);
    } finally {
      setDetailLoading(false);
    }
  };

  const getMethodBadgeClass = (method) => {
    switch (method) {
      case "GET":
        return "bg-blue-50 text-blue-700";
      case "POST":
        return "bg-green-50 text-green-700";
      case "PATCH":
        return "bg-yellow-50 text-yellow-700";
      case "PUT":
        return "bg-purple-50 text-purple-700";
      case "DELETE":
        return "bg-red-50 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Activity className="text-blue-600" />
            Activity Logs
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi lịch sử hoạt động quan trọng trong hệ thống
          </p>
        </div>

        <button
          onClick={() => fetchLogs(pagination.page)}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCcw size={16} />
          {loading ? "Đang tải..." : "Tải lại"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <form
          onSubmit={handleSearchSubmit}
          className="grid gap-4 lg:grid-cols-[1fr_130px_220px_150px_auto_auto]"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tìm kiếm
            </label>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Action, details hoặc path"
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              User ID
            </label>

            <input
              type="number"
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              placeholder="VD: 1"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Action
            </label>

            <select
              name="action"
              value={filters.action}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {actionOptions.map((action) => (
                <option key={action || "ALL"} value={action}>
                  {action || "Tất cả"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Method
            </label>

            <select
              name="method"
              value={filters.method}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {methodOptions.map((method) => (
                <option key={method || "ALL"} value={method}>
                  {method || "Tất cả"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <Search size={18} />
              Tìm
            </button>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"
            >
              <X size={18} />
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Path
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Đang tải activity logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Không có activity log nào.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getMethodBadgeClass(
                          log.method
                        )}`}
                      >
                        {log.method || "UNKNOWN"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      <span className="font-mono text-xs">{log.path}</span>
                    </td>

                    <td className="px-4 py-4 text-sm">
                      {log.user ? (
                        <div>
                          <p className="font-medium text-slate-900">
                            {log.user.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {log.user.email}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400">Unknown</span>
                      )}
                    </td>

                    <td className="max-w-xs px-4 py-4 text-sm text-slate-600">
                      <p className="line-clamp-2">{log.details}</p>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-500">
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleString("vi-VN")
                        : ""}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleViewDetail(log.id)}
                        disabled={detailLoading}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-60"
                      >
                        <Eye size={14} />
                        Xem
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Trang {pagination.page} / {pagination.totalPages || 1} - Tổng{" "}
          {pagination.totalLogs || 0} log
        </p>

        <div className="flex gap-2">
          <button
            disabled={pagination.page <= 1 || loading}
            onClick={() => fetchLogs(pagination.page - 1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trước
          </button>

          <button
            disabled={pagination.page >= pagination.totalPages || loading}
            onClick={() => fetchLogs(pagination.page + 1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Chi tiết Activity Log
                </h2>
                <p className="text-sm text-slate-500">ID: {selectedLog.id}</p>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InfoItem label="Action" value={selectedLog.action} />
              <InfoItem label="Method" value={selectedLog.method} />
              <InfoItem label="Path" value={selectedLog.path} />
              <InfoItem label="IP" value={selectedLog.ip} />
              <InfoItem
                label="Created At"
                value={
                  selectedLog.createdAt
                    ? new Date(selectedLog.createdAt).toLocaleString("vi-VN")
                    : ""
                }
              />
              <InfoItem label="User ID" value={selectedLog.userId || "Null"} />
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">Details</p>
              <p className="mt-2 text-sm text-slate-600">
                {selectedLog.details || "Không có details"}
              </p>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">User Agent</p>
              <p className="mt-2 break-all text-sm text-slate-600">
                {selectedLog.userAgent || "Không có user agent"}
              </p>
            </div>

            {selectedLog.user && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">
                  User thực hiện
                </p>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <InfoItem label="Name" value={selectedLog.user.name} />
                  <InfoItem label="Email" value={selectedLog.user.email} />
                  <InfoItem label="Role" value={selectedLog.user.role} />
                  <InfoItem
                    label="Provider"
                    value={selectedLog.user.provider}
                  />
                  <InfoItem label="Status" value={selectedLog.user.status} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-medium text-slate-700">
        {value || "Không có"}
      </p>
    </div>
  );
}

export default AdminActivityLogsPage;
