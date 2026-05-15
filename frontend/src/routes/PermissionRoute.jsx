import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageSkeleton } from "../components/ui";

function PermissionRoute({ permission, anyPermissions = [] }) {
  const { loading, isAuthenticated, hasPermission, hasAnyPermission } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-8">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow">
          <PageSkeleton />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const allowed = permission
    ? hasPermission(permission)
    : hasAnyPermission(anyPermissions);

  if (!allowed) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}

export default PermissionRoute;
