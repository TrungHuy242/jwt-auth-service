import { useEffect, useRef } from "react";
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useToast } from "./context/ToastContext";
import { useSettings } from "./context/SettingsContext";
import { AUTH_EVENTS } from "./utils/authEvents";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import FilesPage from "./pages/FilesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminActivityLogsPage from "./pages/AdminActivityLogsPage";
import AdminFilesPage from "./pages/AdminFilesPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import {
  User,
  LogOut,
  Shield,
  LayoutDashboard,
  Bell,
  FileText,
  Settings,
} from "lucide-react";

function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();

  const navLink = (to, label, icon) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link
        key={to}
        to={to}
        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {settings.siteLogo ? (
            <img
              src={settings.siteLogo}
              alt={settings.siteName}
              className="h-9 w-9 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
              {settings.siteName?.charAt(0)?.toUpperCase() || "F"}
            </div>
          )}

          <span className="font-bold text-slate-900">
            {settings.siteName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {navLink("/profile", "Hồ sơ", <User size={16} />)}
              {navLink("/notifications", "Thông báo", <Bell size={16} />)}
              {navLink("/files", "Files", <FileText size={16} />)}
              {isAdmin && navLink("/admin", "Admin", <LayoutDashboard size={16} />)}
              {isAdmin && (
                <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
                  <span className="text-xs font-medium uppercase text-slate-400">Admin:</span>
                  {navLink("/admin/dashboard", "Dashboard", <LayoutDashboard size={14} />)}
                  {navLink("/admin/files", "Files", <FileText size={14} />)}
                  {navLink("/admin/settings", "Settings", <Settings size={14} />)}
                </div>
              )}
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <User size={14} />
                  </div>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

function AppLayout({ children }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useSettings();
  const sessionExpiredToastShownRef = useRef(false);

  useEffect(() => {
    if (user) {
      sessionExpiredToastShownRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    const handleSessionExpired = () => {
      if (!sessionExpiredToastShownRef.current) {
        toast.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        sessionExpiredToastShownRef.current = true;
      }
      navigate("/login", { replace: true });
    };

    window.addEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired);

    return () => {
      window.removeEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired);
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <footer className="border-t border-slate-200 bg-white py-4">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500">
          {settings.footerText}
        </div>
      </footer>
    </div>
  );
}

function HomeRedirect() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }
  return <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/files"
          element={
            <ProtectedRoute>
              <FilesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/activity-logs"
          element={
            <AdminRoute>
              <AdminActivityLogsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/files"
          element={
            <AdminRoute>
              <AdminFilesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminSettingsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
