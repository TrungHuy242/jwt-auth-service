import { useEffect, useState } from "react";
import { RefreshCcw, Search, Shield, ShieldCheck, UserCog, X } from "lucide-react";
import { adminApi } from "../api/adminApi";
import { roleApi } from "../api/roleApi";
import { TableSkeleton } from "../components/ui";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmContext";
import { getErrorMessage, getSuccessMessage } from "../utils/toastMessage";
import { confirmPresets } from "../utils/confirmPresets";

function AdminUsersPage() {
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalUsers: 0,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
    provider: "",
  });

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [roleLoading, setRoleLoading] = useState(false);

  const fetchUsers = async (page = 1) => {
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

      if (filters.role) {
        params.role = filters.role;
      }

      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.provider) {
        params.provider = filters.provider;
      }

      const response = await adminApi.getUsers(params);

      setUsers(response.users || []);
      setPagination(response.pagination);
    } catch (error) {
      const message = getErrorMessage(error, "Khong tai duoc danh sach nguoi dung");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await roleApi.getRoles();
      setRoles(response.roles || []);
    } catch (error) {
      const message = getErrorMessage(error, "Khong tai duoc danh sach role");
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    fetchRoles();
  }, [filters.role, filters.status, filters.provider]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchUsers(1);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccessMessage("");
    setError("");
  };

  const handleRefresh = () => {
    fetchUsers(pagination.page);
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    const isBlock = newStatus === "BLOCKED";

    const ok = await confirm(
      isBlock
        ? confirmPresets.block({
            message:
              "Ban co chan muon khoa tai khoan nay khong? Nguoi dung se khong the dang nhap cho den khi duoc mo khoa.",
          })
        : confirmPresets.unblock({
            message:
              "Ban co chan muon mo khoa tai khoan nay khong? Nguoi dung se co the dang nhap lai.",
          })
    );

    if (!ok) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await adminApi.updateUserStatus(userId, newStatus);

      const message = getSuccessMessage(response, "Cap nhat trang thai thanh cong");
      setSuccessMessage(message);
      toast.success(message);

      await fetchUsers(pagination.page);
    } catch (error) {
      const message = getErrorMessage(error, "Cap nhat trang thai that bai");
      setError(message);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);

    const userRoleIds =
      user.userRoles?.map((userRole) => userRole.roleId) || [];

    if (userRoleIds.length > 0) {
      setSelectedRoleIds(userRoleIds);
    } else {
      const fallbackRole = roles.find((role) => role.name === user.role);
      setSelectedRoleIds(fallbackRole ? [fallbackRole.id] : []);
    }

    setRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    if (roleLoading) return;

    setRoleModalOpen(false);
    setSelectedUser(null);
    setSelectedRoleIds([]);
  };

  const toggleRole = (roleId) => {
    setSelectedRoleIds((prev) => {
      if (prev.includes(roleId)) {
        return prev.filter((id) => id !== roleId);
      }
      return [...prev, roleId];
    });
  };

  const handleSaveUserRoles = async () => {
    if (!selectedUser) return;

    if (selectedRoleIds.length === 0) {
      toast.warning("User phai co it nhat mot role");
      return;
    }

    try {
      setRoleLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await roleApi.updateUserRoles(
        selectedUser.id,
        selectedRoleIds
      );

      const message = getSuccessMessage(
        response,
        "Cap nhat role cho user thanh cong"
      );

      setSuccessMessage(message);
      toast.success(message);

      closeRoleModal();
      await fetchUsers(pagination.page);
    } catch (error) {
      const message = getErrorMessage(error, "Cap nhat role cho user that bai");
      setError(message);
      toast.error(message);
    } finally {
      setRoleLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    return status === "ACTIVE"
      ? "bg-green-50 text-green-700"
      : "bg-red-50 text-red-700";
  };

  const getProviderBadgeClass = (provider) => {
    switch (provider) {
      case "google":
        return "bg-red-50 text-red-700";
      case "facebook":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <UserCog className="text-blue-600" />
            Quan ly nguoi dung
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tim kiem, loc, gan role va khoa / mo khoa tai khoan
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCcw size={16} />
          {loading ? "Dang tai..." : "Tai lai"}
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

      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <form onSubmit={handleSearchSubmit} className="grid gap-4 lg:grid-cols-[1fr_160px_160px_160px_auto]">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tim kiem
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
                placeholder="Ten, email hoac so dien thoai"
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Role
            </label>

            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Tat ca</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Tat ca</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Provider
            </label>

            <select
              name="provider"
              value={filters.provider}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Tat ca</option>
              <option value="local">local</option>
              <option value="google">google</option>
              <option value="facebook">facebook</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <Search size={18} />
              Tim
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <TableSkeleton rows={8} columns={7} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Provider
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Verified
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                      Khong co nguoi dung nao.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-slate-900">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                            {user.phone && (
                              <p className="text-xs text-slate-400">{user.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {user.userRoles?.length > 0 ? (
                            user.userRoles.map((userRole) => (
                              <span
                                key={userRole.id}
                                className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700"
                              >
                                {userRole.role?.name}
                              </span>
                            ))
                          ) : (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              {user.role}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getProviderBadgeClass(
                            user.provider
                          )}`}
                        >
                          {user.provider}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.isVerified
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {user.isVerified ? "Yes" : "No"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                          : ""}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            disabled={actionLoading}
                            onClick={() => openRoleModal(user)}
                            className="flex items-center gap-1 rounded-xl border border-purple-200 px-3 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-60"
                          >
                            <ShieldCheck size={14} />
                            Gan role
                          </button>

                          <button
                            disabled={actionLoading}
                            onClick={() =>
                              handleUpdateStatus(
                                user.id,
                                user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE"
                              )
                            }
                            className={`rounded-xl border px-3 py-2 text-xs font-medium disabled:opacity-60 ${
                              user.status === "ACTIVE"
                                ? "border-red-200 text-red-700 hover:bg-red-50"
                                : "border-green-200 text-green-700 hover:bg-green-50"
                            }`}
                          >
                            {user.status === "ACTIVE" ? "Khoa" : "Mo khoa"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Trang {pagination.page} / {pagination.totalPages || 1} - Tong{" "}
          {pagination.totalUsers || 0} user
        </p>

        <div className="flex gap-2">
          <button
            disabled={pagination.page <= 1 || loading}
            onClick={() => fetchUsers(pagination.page - 1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Truoc
          </button>

          <button
            disabled={pagination.page >= pagination.totalPages || loading}
            onClick={() => fetchUsers(pagination.page + 1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Gan role cho user
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedUser?.name} - {selectedUser?.email}
                </p>
              </div>

              <button
                type="button"
                onClick={closeRoleModal}
                disabled={roleLoading}
                className="rounded-xl border border-slate-300 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Da chon{" "}
              <span className="font-bold">{selectedRoleIds.length}</span> role.
              User phai co it nhat mot role.
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {roles.map((role) => {
                const checked = selectedRoleIds.includes(role.id);

                return (
                  <label
                    key={role.id}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      checked
                        ? "border-blue-200 bg-blue-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRole(role.id)}
                        className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800">
                            {role.name}
                          </p>

                          {role.isSystem && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                              System
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {role.description || "Khong co mo ta"}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {role.rolePermissions?.length || 0} permission
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeRoleModal}
                disabled={roleLoading}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Huy
              </button>

              <button
                type="button"
                onClick={handleSaveUserRoles}
                disabled={roleLoading}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {roleLoading ? "Dang luu..." : "Luu role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsersPage;
