export const confirmPresets = {
  delete: ({
    title = "Xác nhận xóa",
    message = "Bạn có chắc muốn xóa dữ liệu này không? Thao tác này không thể hoàn tác.",
    confirmText = "Xóa",
  } = {}) => ({
    title,
    message,
    confirmText,
    cancelText: "Hủy",
    type: "danger",
  }),

  block: ({
    title = "Khóa tài khoản",
    message = "Bạn có chắc muốn khóa tài khoản này không?",
    confirmText = "Khóa tài khoản",
  } = {}) => ({
    title,
    message,
    confirmText,
    cancelText: "Hủy",
    type: "danger",
  }),

  unblock: ({
    title = "Mở khóa tài khoản",
    message = "Bạn có chắc muốn mở khóa tài khoản này không?",
    confirmText = "Mở khóa",
  } = {}) => ({
    title,
    message,
    confirmText,
    cancelText: "Hủy",
    type: "success",
  }),

  warning: ({
    title = "Xác nhận thao tác",
    message = "Bạn có chắc muốn thực hiện thao tác này không?",
    confirmText = "Xác nhận",
  } = {}) => ({
    title,
    message,
    confirmText,
    cancelText: "Hủy",
    type: "warning",
  }),

  info: ({
    title = "Xác nhận thao tác",
    message = "Bạn có chắc muốn tiếp tục không?",
    confirmText = "Tiếp tục",
  } = {}) => ({
    title,
    message,
    confirmText,
    cancelText: "Hủy",
    type: "info",
  }),
};
