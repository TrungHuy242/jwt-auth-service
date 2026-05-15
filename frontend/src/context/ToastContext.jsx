import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const DEFAULT_DURATION = 3500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const addToast = ({ type = "info", message, duration = DEFAULT_DURATION }) => {
    if (!message) return;

    const id = Date.now() + Math.random();

    const newToast = {
      id,
      type,
      message,
    };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const toast = useMemo(
    () => ({
      success: (message, duration) =>
        addToast({ type: "success", message, duration }),

      error: (message, duration) =>
        addToast({ type: "error", message, duration }),

      info: (message, duration) =>
        addToast({ type: "info", message, duration }),

      warning: (message, duration) =>
        addToast({ type: "warning", message, duration }),
    }),
    []
  );

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
