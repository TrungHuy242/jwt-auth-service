import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const toastStyles = {
  success: {
    box: "border-green-200 bg-green-50 text-green-800",
    icon: "text-green-600",
    Icon: CheckCircle2,
  },
  error: {
    box: "border-red-200 bg-red-50 text-red-800",
    icon: "text-red-600",
    Icon: AlertCircle,
  },
  info: {
    box: "border-blue-200 bg-blue-50 text-blue-800",
    icon: "text-blue-600",
    Icon: Info,
  },
  warning: {
    box: "border-yellow-200 bg-yellow-50 text-yellow-800",
    icon: "text-yellow-600",
    Icon: TriangleAlert,
  },
};

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed right-4 top-4 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type] || toastStyles.info;
        const Icon = style.Icon;

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur transition-all ${style.box}`}
          >
            <Icon size={20} className={`mt-0.5 shrink-0 ${style.icon}`} />

            <p className="flex-1 text-sm font-medium leading-5">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="rounded-lg p-1 opacity-70 hover:bg-white/60 hover:opacity-100"
              aria-label="Đóng thông báo"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
