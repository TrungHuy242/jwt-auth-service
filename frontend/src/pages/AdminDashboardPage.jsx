import { useEffect, useState } from "react";
import {
  Activity,
  Bell,
  FileText,
  RefreshCcw,
  ShieldAlert,
  UserCheck,
  Users,
} from "lucide-react";
import { adminApi } from "../api/adminApi";
import { PageSkeleton } from "../components/ui";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../utils/toastMessage";

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
          {description && (
            <p className="mt-2 text-xs text-slate-500">{description}</p>
          )}
        </div>

        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function SmallList({ title, items, labelKey, countKey }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">{title}</h3>

      {items?.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={`${item[labelKey]}-${index}`}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
            >
              <span className="text-sm font-medium text-slate-700">
                {item[labelKey] || "UNKNOWN"}
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {item[countKey]}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">Chưa có dữ liệu.</p>
      )}
    </div>
  );
}

function AdminDashboardPage() {
  const { toast } = useToast();

  const [overview, setOverview] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [fileStats, setFileStats] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [recent, setRecent] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        overviewRes,
        userStatsRes,
        fileStatsRes,
        systemStatsRes,
        recentRes,
      ] = await Promise.all([
        adminApi.getDashboardOverview(),
        adminApi.getUserStatistics(),
        adminApi.getFileStatistics(),
        adminApi.getSystemStatistics(),
        adminApi.getRecentActivities({ limit: 5 }),
      ]);

      setOverview(overviewRes.overview);
      setUserStats(userStatsRes.statistics);
      setFileStats(fileStatsRes.statistics);
      setSystemStats(systemStatsRes.statistics);
      setRecent(recentRes.recent);
    } catch (error) {
      const message = getErrorMessage(error, "Không thể tải dashboard");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshDashboard = async () => {
    await fetchDashboard();
    toast.success("Tải lại dashboard thành công");
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tổng quan nhanh về hệ thống backend core
          </p>
        </div>

        <button
          onClick={handleRefreshDashboard}
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

      {loading && !overview ? <PageSkeleton /> : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Tổng người dùng"
              value={overview?.totalUsers ?? 0}
              icon={Users}
              description={`User mới hôm nay: ${overview?.newUsersToday ?? 0}`}
            />

            <StatCard
              title="User đang hoạt động"
              value={overview?.activeUsers ?? 0}
              icon={UserCheck}
              description={`Bị khóa: ${overview?.blockedUsers ?? 0}`}
            />

            <StatCard
              title="Tổng file upload"
              value={overview?.totalFiles ?? 0}
              icon={FileText}
              description={`Dung lượng: ${fileStats?.totalSizeMB ?? 0} MB`}
            />

            <StatCard
              title="Login hôm nay"
              value={overview?.loginToday ?? 0}
              icon={Activity}
              description={`Tổng logs: ${overview?.totalActivityLogs ?? 0}`}
            />

            <StatCard
              title="Notification"
              value={overview?.totalNotifications ?? 0}
              icon={Bell}
              description={`Chưa đọc: ${
                systemStats?.notifications?.unreadNotifications ?? 0
              }`}
            />

            <StatCard
              title="User chưa verify"
              value={userStats?.unverifiedUsers ?? 0}
              icon={ShieldAlert}
              description={`Đã verify: ${userStats?.verifiedUsers ?? 0}`}
            />

            <StatCard
              title="File hôm nay"
              value={fileStats?.filesUploadedToday ?? 0}
              icon={FileText}
              description="Số file upload trong ngày"
            />

            <StatCard
              title="Activity hôm nay"
              value={systemStats?.activityLogs?.activityLogsToday ?? 0}
              icon={Activity}
              description="Số log phát sinh trong ngày"
            />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <SmallList
              title="User theo role"
              items={userStats?.usersByRole || []}
              labelKey="role"
              countKey="count"
            />

            <SmallList
              title="User theo provider"
              items={userStats?.usersByProvider || []}
              labelKey="provider"
              countKey="count"
            />

            <SmallList
              title="User theo status"
              items={userStats?.usersByStatus || []}
              labelKey="status"
              countKey="count"
            />

            <SmallList
              title="File theo type"
              items={fileStats?.filesByType || []}
              labelKey="type"
              countKey="count"
            />

            <SmallList
              title="Notification theo type"
              items={systemStats?.notifications?.notificationsByType || []}
              labelKey="type"
              countKey="count"
            />

            <SmallList
              title="Activity theo method"
              items={systemStats?.activityLogs?.activityLogsByMethod || []}
              labelKey="method"
              countKey="count"
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                User mới gần đây
              </h3>

              {recent?.recentUsers?.length > 0 ? (
                <div className="space-y-3">
                  {recent.recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="rounded-xl bg-slate-50 px-4 py-3"
                    >
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                      <div className="mt-2 flex gap-2 text-xs">
                        <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">
                          {user.role}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                          {user.provider}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Chưa có user mới.</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Activity log gần đây
              </h3>

              {recent?.recentActivityLogs?.length > 0 ? (
                <div className="space-y-3">
                  {recent.recentActivityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-xl bg-slate-50 px-4 py-3"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                          {log.action}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(log.createdAt).toLocaleString("vi-VN")}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-600">
                        {log.details || log.path}
                      </p>

                      {log.user && (
                        <p className="mt-1 text-xs text-slate-400">
                          User: {log.user.email}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Chưa có activity log.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboardPage;
