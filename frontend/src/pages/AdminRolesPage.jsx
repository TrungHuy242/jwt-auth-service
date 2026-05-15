import { useEffect, useState } from "react";
import {
  Edit,
  KeyRound,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleApi } from "../api/roleApi";
import { FormError, TableSkeleton } from "../components/ui";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmContext";
import { confirmPresets } from "../utils/confirmPresets";
import { roleSchema } from "../validations";
import { getErrorMessage, getSuccessMessage } from "../utils/toastMessage";

function AdminRolesPage() {
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [permissions, setPermissions] = useState([]);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [permissionLoading, setPermissionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await roleApi.getRoles();

      setRoles(response.roles || []);
    } catch (error) {
      const message = getErrorMessage(error, "Khong tai duoc danh sach role");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await roleApi.getPermissions();
      setPermissions(response.permissions || []);
    } catch (error) {
      const message = getErrorMessage(error, "Khong tai duoc danh sach permission");
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const openCreateModal = () => {
    setEditingRole(null);
    reset({
      name: "",
      description: "",
    });
    setModalOpen(true);
    setError("");
    setSuccessMessage("");
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    reset({
      name: role.name || "",
      description: role.description || "",
    });
    setModalOpen(true);
    setError("");
    setSuccessMessage("");
  };

  const closeModal = () => {
    if (actionLoading) return;

    setModalOpen(false);
    setEditingRole(null);
    reset({
      name: "",
      description: "",
    });
  };

  const openPermissionModal = async (role) => {
    try {
      setPermissionLoading(true);
      setSelectedRole(role);
      setPermissionModalOpen(true);

      const response = await roleApi.getRoleById(role.id);
      const detailRole = response.role;

      const ids =
        detailRole.rolePermissions?.map(
          (rolePermission) => rolePermission.permissionId
        ) || [];

      setSelectedPermissionIds(ids);
    } catch (error) {
      const message = getErrorMessage(error, "Khong tai quyen cua role");
      toast.error(message);
    } finally {
      setPermissionLoading(false);
    }
  };

  const closePermissionModal = () => {
    if (actionLoading) return;

    setPermissionModalOpen(false);
    setSelectedRole(null);
    setSelectedPermissionIds([]);
  };

  const togglePermission = (permissionId) => {
    setSelectedPermissionIds((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId);
      }
      return [...prev, permissionId];
    });
  };

  const togglePermissionGroup = (groupName) => {
    const groupPermissionIds = permissions
      .filter((permission) => permission.group === groupName)
      .map((permission) => permission.id);

    const isAllSelected = groupPermissionIds.every((id) =>
      selectedPermissionIds.includes(id)
    );

    if (isAllSelected) {
      setSelectedPermissionIds((prev) =>
        prev.filter((id) => !groupPermissionIds.includes(id))
      );
    } else {
      setSelectedPermissionIds((prev) =>
        Array.from(new Set([...prev, ...groupPermissionIds]))
      );
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await roleApi.updateRolePermissions(
        selectedRole.id,
        selectedPermissionIds
      );

      const message = getSuccessMessage(
        response,
        "Cap nhat permission cho role thanh cong"
      );

      setSuccessMessage(message);
      toast.success(message);

      closePermissionModal();
      await fetchRoles();
    } catch (error) {
      const message = getErrorMessage(
        error,
        "Cap nhat permission cho role that bai"
      );
      setError(message);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      let response;

      if (editingRole) {
        response = await roleApi.updateRole(editingRole.id, data);
      } else {
        response = await roleApi.createRole(data);
      }

      const message = getSuccessMessage(
        response,
        editingRole ? "Cap nhat role thanh cong" : "Tao role thanh cong"
      );

      setSuccessMessage(message);
      toast.success(message);

      closeModal();
      await fetchRoles();
    } catch (error) {
      const message = getErrorMessage(
        error,
        editingRole ? "Cap nhat role that bai" : "Tao role that bai"
      );

      setError(message);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRole = async (role) => {
    if (role.isSystem) {
      toast.warning("Khong the xoa role he thong");
      return;
    }

    const userCount = role._count?.userRoles || 0;

    if (userCount > 0) {
      toast.warning("Khong the xoa role dang duoc gan cho user");
      return;
    }

    const ok = await confirm(
      confirmPresets.delete({
        title: "Xoa role",
        message: `Ban co chan muon xoa role "${role.name}" khong? Thao tac nay khong the hoan tac.`,
        confirmText: "Xoa role",
      })
    );

    if (!ok) return;

    try {
      setActionLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await roleApi.deleteRole(role.id);

      const message = getSuccessMessage(response, "Xoa role thanh cong");

      setSuccessMessage(message);
      toast.success(message);

      await fetchRoles();
    } catch (error) {
      const message = getErrorMessage(error, "Xoa role that bai");
      setError(message);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const getPermissionCount = (role) => {
    return role.rolePermissions?.length || 0;
  };

  const groupedPermissions = permissions.reduce((groups, permission) => {
    const groupName = permission.group || "Other";
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(permission);
    return groups;
  }, {});

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <ShieldCheck className="text-blue-600" />
            Quan ly Role
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quan ly vai tro nguoi dung va chuan bi phan quyen chi tiet cho he thong
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={fetchRoles}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCcw size={16} />
            Tai lai
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={16} />
            Tao role
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

      {loading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Mo ta
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    System
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Users
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Permissions
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {roles.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Chua co role nao.
                    </td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr key={role.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {role.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: {role.id}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {role.description || "Khong co mo ta"}
                      </td>

                      <td className="px-4 py-4">
                        {role.isSystem ? (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            System
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            Custom
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-slate-700">
                        {role._count?.userRoles || 0}
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-slate-700">
                        {getPermissionCount(role)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openPermissionModal(role)}
                            className="inline-flex items-center gap-1 rounded-xl border border-purple-200 px-3 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50"
                          >
                            <KeyRound size={14} />
                            Phan quyen
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditModal(role)}
                            className="inline-flex items-center gap-1 rounded-xl border border-blue-200 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50"
                          >
                            <Edit size={14} />
                            Sua
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteRole(role)}
                            disabled={
                              role.isSystem ||
                              (role._count?.userRoles || 0) > 0 ||
                              actionLoading
                            }
                            className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            Xoa
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingRole ? "Cap nhat role" : "Tao role moi"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingRole
                    ? "Chinh sua thong tin role hien tai"
                    : "Tao role moi de gan quyen cho user"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={actionLoading}
                className="rounded-xl border border-slate-300 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Ten role
                </label>
                <input
                  type="text"
                  {...register("name")}
                  disabled={editingRole?.isSystem}
                  className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 disabled:bg-slate-100 disabled:text-slate-500 ${
                    errors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  placeholder="VD: MANAGER"
                />
                <FormError message={errors.name?.message} />

                {editingRole?.isSystem && (
                  <p className="mt-2 text-xs text-yellow-600">
                    Role he thong khong duoc doi ten.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Mo ta
                </label>
                <textarea
                  rows={4}
                  {...register("description")}
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Nhap mo ta role"
                />
                <FormError message={errors.description?.message} />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={actionLoading}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Huy
                </button>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {actionLoading
                    ? "Dang luu..."
                    : editingRole
                    ? "Cap nhat"
                    : "Tao role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {permissionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Phan quyen role: {selectedRole?.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Chon cac quyen ma role nay duoc phep su dung trong he thong
                </p>
              </div>

              <button
                type="button"
                onClick={closePermissionModal}
                disabled={actionLoading}
                className="rounded-xl border border-slate-300 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {permissionLoading ? (
              <div className="rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                Dang tai permission...
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  Da chon{" "}
                  <span className="font-bold">{selectedPermissionIds.length}</span> /{" "}
                  <span className="font-bold">{permissions.length}</span> quyen.
                </div>

                {Object.entries(groupedPermissions).map(
                  ([groupName, groupPermissions]) => {
                    const groupPermissionIds = groupPermissions.map(
                      (permission) => permission.id
                    );

                    const isAllSelected = groupPermissionIds.every((id) =>
                      selectedPermissionIds.includes(id)
                    );

                    return (
                      <section
                        key={groupName}
                        className="rounded-2xl border border-slate-200 p-5"
                      >
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-base font-bold text-slate-900">
                              {groupName}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {groupPermissions.length} permission
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => togglePermissionGroup(groupName)}
                            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            {isAllSelected ? "Bo chon nhom" : "Chon ca nhom"}
                          </button>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          {groupPermissions.map((permission) => {
                            const checked = selectedPermissionIds.includes(
                              permission.id
                            );

                            return (
                              <label
                                key={permission.id}
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
                                    onChange={() => togglePermission(permission.id)}
                                    className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                  />

                                  <div>
                                    <p className="font-semibold text-slate-800">
                                      {permission.name}
                                    </p>
                                    <p className="mt-1 font-mono text-xs text-slate-500">
                                      {permission.key}
                                    </p>
                                    {permission.description && (
                                      <p className="mt-2 text-xs text-slate-500">
                                        {permission.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </section>
                    );
                  }
                )}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closePermissionModal}
                disabled={actionLoading}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Huy
              </button>

              <button
                type="button"
                onClick={handleSavePermissions}
                disabled={actionLoading || permissionLoading}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {actionLoading ? "Dang luu..." : "Luu permission"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRolesPage;
