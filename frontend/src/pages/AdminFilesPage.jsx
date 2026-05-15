import { useEffect, useState } from "react";
import {
  Download,
  Eye,
  FileText,
  RefreshCcw,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { uploadApi } from "../api/uploadApi";
import { TableSkeleton } from "../components/ui";
import { useToast } from "../context/ToastContext";
import { useConfirm } from "../context/ConfirmContext";
import { confirmPresets } from "../utils/confirmPresets";
import { getErrorMessage } from "../utils/toastMessage";

const fileTypes = ["", "IMAGE", "DOCUMENT", "VIDEO", "AUDIO", "OTHER"];

function AdminFilesPage() {
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const [files, setFiles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalFiles: 0,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    search: "",
    folder: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [uploadMode, setUploadMode] = useState("single");
  const [folder, setFolder] = useState("general");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const fetchFiles = async (page = 1) => {
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

      if (filters.folder) {
        params.folder = filters.folder;
      }

      if (filters.type) {
        params.type = filters.type;
      }

      const response = await uploadApi.getFiles(params);

      setFiles(response.files || []);
      setPagination(
        response.pagination || {
          page,
          limit: 10,
          totalFiles: response.files?.length || 0,
          totalPages: 1,
        }
      );
    } catch (error) {
      const message = getErrorMessage(error, "Không thể tải danh sách file");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(1);
  }, [filters.type]);

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
    fetchFiles(1);
  };

  const handleRefresh = () => {
    fetchFiles(pagination.page);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleUploadSubmit = async (event) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      toast.warning("Vui lòng chọn file cần upload");
      return;
    }

    if (!folder.trim()) {
      toast.warning("Vui lòng nhập folder");
      return;
    }

    const formData = new FormData();
    formData.append("folder", folder.trim());

    try {
      setUploadLoading(true);
      setError("");

      let response;

      if (uploadMode === "single") {
        formData.append("file", selectedFiles[0]);
        response = await uploadApi.uploadSingle(formData);
      } else {
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });

        response = await uploadApi.uploadMultiple(formData);
      }

      toast.success(response.message || "Upload file thành công");

      setSelectedFiles([]);
      setFolder("general");

      const fileInput = document.getElementById("file-upload-input");
      if (fileInput) {
        fileInput.value = "";
      }

      await fetchFiles(1);
    } catch (error) {
      const message = getErrorMessage(error, "Upload file thất bại");
      setError(message);
      toast.error(message);
    } finally {
      setUploadLoading(false);
    }
  };

  const formatFileSize = (size) => {
    if (!size && size !== 0) return "Không rõ";

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case "IMAGE":
        return "bg-green-50 text-green-700";
      case "DOCUMENT":
        return "bg-blue-50 text-blue-700";
      case "VIDEO":
        return "bg-purple-50 text-purple-700";
      case "AUDIO":
        return "bg-yellow-50 text-yellow-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getFileUrl = (file) => {
    if (!file?.fileUrl) return "";

    if (file.fileUrl.startsWith("http")) {
      return file.fileUrl;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "";
    const backendUrl = apiUrl.replace("/api", "");

    return `${backendUrl}${file.fileUrl}`;
  };

  const handleViewFile = async (id) => {
    try {
      setDetailLoading(true);
      setError("");

      const response = await uploadApi.getFileById(id);

      setSelectedFile(response.file || response.uploadedFile || response.data);
    } catch (error) {
      const message = getErrorMessage(error, "Không thể lấy chi tiết file");
      setError(message);
      toast.error(message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleOpenFile = (file) => {
    const url = getFileUrl(file);

    if (!url) {
      toast.error("Không tìm thấy đường dẫn file");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDeleteFile = async (file) => {
    const ok = await confirm(
      confirmPresets.delete({
        title: "Xóa file",
        message: `Bạn có chắc muốn xóa file "${
          file.originalName || file.fileName
        }" không? Thao tác này sẽ xóa file khỏi hệ thống.`,
        confirmText: "Xóa file",
      })
    );

    if (!ok) return;

    try {
      setDeleteLoadingId(file.id);
      setError("");

      const response = await uploadApi.deleteFile(file.id);

      toast.success(response.message || "Xóa file thành công");

      if (selectedFile?.id === file.id) {
        setSelectedFile(null);
      }

      await fetchFiles(pagination.page);
    } catch (error) {
      const message = getErrorMessage(error, "Xóa file thất bại");
      setError(message);
      toast.error(message);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <FileText className="text-blue-600" />
            Quản lý file hệ thống
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Admin xem, tìm kiếm, tải xuống và xóa toàn bộ file trong hệ thống
          </p>
        </div>

        <button
          onClick={handleRefresh}
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

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <UploadCloud className="text-blue-600" size={22} />
          <h2 className="text-lg font-semibold text-slate-900">Upload file</h2>
        </div>

        <form
          onSubmit={handleUploadSubmit}
          className="grid gap-4 lg:grid-cols-[160px_1fr_1fr_auto]"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Chế độ
            </label>

            <select
              value={uploadMode}
              onChange={(event) => {
                setUploadMode(event.target.value);
                setSelectedFiles([]);

                const fileInput = document.getElementById("file-upload-input");
                if (fileInput) {
                  fileInput.value = "";
                }
              }}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="single">1 file</option>
              <option value="multiple">Nhiều file</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Folder
            </label>

            <input
              type="text"
              value={folder}
              onChange={(event) => setFolder(event.target.value)}
              placeholder="VD: documents, avatars, products"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Chọn file
            </label>

            <input
              id="file-upload-input"
              type="file"
              multiple={uploadMode === "multiple"}
              onChange={handleFileChange}
              className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />

            {selectedFiles.length > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                Đã chọn {selectedFiles.length} file
              </p>
            )}
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={uploadLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UploadCloud size={18} />
              {uploadLoading ? "Đang upload..." : "Upload"}
            </button>
          </div>
        </form>

        {selectedFiles.length > 0 && (
          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <p className="mb-2 text-sm font-medium text-slate-700">
              File đã chọn:
            </p>

            <div className="space-y-1">
              {selectedFiles.map((file, index) => (
                <p key={`${file.name}-${index}`} className="text-sm text-slate-500">
                  {index + 1}. {file.name}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <form
          onSubmit={handleSearchSubmit}
          className="grid gap-4 lg:grid-cols-[1fr_180px_180px_auto]"
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
                placeholder="Tên file hoặc tên gốc"
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Folder
            </label>

            <input
              type="text"
              name="folder"
              value={filters.folder}
              onChange={handleFilterChange}
              placeholder="VD: documents"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Loại file
            </label>

            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {fileTypes.map((type) => (
                <option key={type || "ALL"} value={type}>
                  {type || "Tất cả"}
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
        </form>
      </div>

      {loading ? (
        <TableSkeleton rows={8} columns={8} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    File
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Folder
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Mime Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Uploaded By
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Uploaded
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {files.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Chưa có file nào.
                    </td>
                  </tr>
                ) : (
                  files.map((file) => (
                    <tr key={file.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {file.type === "IMAGE" && file.fileUrl ? (
                            <img
                              src={getFileUrl(file)}
                              alt={file.originalName}
                              className="h-11 w-11 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                              <FileText size={22} />
                            </div>
                          )}

                          <div>
                            <p className="max-w-[260px] truncate font-medium text-slate-900">
                              {file.originalName || file.fileName}
                            </p>
                            <p className="max-w-[260px] truncate text-xs text-slate-400">
                              {file.fileName}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getTypeBadgeClass(
                            file.type
                          )}`}
                        >
                          {file.type || "OTHER"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {file.folder || "general"}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {formatFileSize(file.size)}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {file.mimeType || "Không rõ"}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {file.uploadedBy || file.user ? (
                          <div>
                            <p className="font-medium text-slate-900">
                              {(file.uploadedBy || file.user).name || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {(file.uploadedBy || file.user).email || ""}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400">
                            User ID: {file.uploadedById || "Unknown"}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {file.createdAt
                          ? new Date(file.createdAt).toLocaleString("vi-VN")
                          : ""}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewFile(file.id)}
                            disabled={detailLoading}
                            className="inline-flex items-center gap-1 rounded-xl border border-blue-200 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-60"
                          >
                            <Eye size={14} />
                            Xem
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenFile(file)}
                            className="inline-flex items-center gap-1 rounded-xl border border-green-200 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-50"
                          >
                            <Download size={14} />
                            Mở
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteFile(file)}
                            disabled={deleteLoadingId === file.id}
                            className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                          >
                            <Trash2 size={14} />
                            {deleteLoadingId === file.id ? "Đang xóa..." : "Xóa"}
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
          Trang {pagination.page} / {pagination.totalPages || 1} - Tổng{" "}
          {pagination.totalFiles || 0} file
        </p>

        <div className="flex gap-2">
          <button
            disabled={pagination.page <= 1 || loading}
            onClick={() => fetchFiles(pagination.page - 1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trước
          </button>

          <button
            disabled={pagination.page >= pagination.totalPages || loading}
            onClick={() => fetchFiles(pagination.page + 1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Chi tiết file
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  ID: {selectedFile.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="rounded-xl border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
              >
                <X size={18} />
              </button>
            </div>

            {selectedFile.type === "IMAGE" && getFileUrl(selectedFile) && (
              <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <img
                  src={getFileUrl(selectedFile)}
                  alt={selectedFile.originalName}
                  className="max-h-[360px] w-full object-contain"
                />
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <InfoItem
                label="Tên gốc"
                value={selectedFile.originalName || "Không có"}
              />
              <InfoItem
                label="Tên lưu trên server"
                value={selectedFile.fileName || "Không có"}
              />
              <InfoItem label="Type" value={selectedFile.type || "OTHER"} />
              <InfoItem label="Folder" value={selectedFile.folder || "general"} />
              <InfoItem
                label="Kích thước"
                value={formatFileSize(selectedFile.size)}
              />
              <InfoItem
                label="Mime Type"
                value={selectedFile.mimeType || "Không rõ"}
              />
              <InfoItem
                label="Ngày upload"
                value={
                  selectedFile.createdAt
                    ? new Date(selectedFile.createdAt).toLocaleString("vi-VN")
                    : "Không rõ"
                }
              />
              <InfoItem
                label="Ngày cập nhật"
                value={
                  selectedFile.updatedAt
                    ? new Date(selectedFile.updatedAt).toLocaleString("vi-VN")
                    : "Không rõ"
                }
              />
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">Người upload</p>

              {selectedFile.uploadedBy || selectedFile.user ? (
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <InfoItem
                    label="Name"
                    value={(selectedFile.uploadedBy || selectedFile.user).name}
                  />
                  <InfoItem
                    label="Email"
                    value={(selectedFile.uploadedBy || selectedFile.user).email}
                  />
                  <InfoItem
                    label="Role"
                    value={(selectedFile.uploadedBy || selectedFile.user).role}
                  />
                  <InfoItem
                    label="User ID"
                    value={selectedFile.uploadedById}
                  />
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  User ID: {selectedFile.uploadedById || "Không rõ"}
                </p>
              )}
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">URL</p>
              <p className="mt-2 break-all text-sm text-slate-600">
                {getFileUrl(selectedFile)}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => handleOpenFile(selectedFile)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Download size={18} />
                Mở / Download
              </button>

              <button
                type="button"
                onClick={() => handleDeleteFile(selectedFile)}
                disabled={deleteLoadingId === selectedFile.id}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                <Trash2 size={18} />
                {deleteLoadingId === selectedFile.id ? "Đang xóa..." : "Xóa file"}
              </button>
            </div>
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

export default AdminFilesPage;
