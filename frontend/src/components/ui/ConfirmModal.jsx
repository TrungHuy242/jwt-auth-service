import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Info,
  X,
} from "lucide-react";
import { useConfirm } from "../../context/ConfirmContext";

const modalConfig = {
  default: {
    icon: HelpCircle,
    iconBox: "bg-slate-100 text-slate-700",
    confirmButton: "bg-slate-900 text-white hover:bg-slate-800",
  },
  danger: {
    icon: AlertTriangle,
    iconBox: "bg-red-50 text-red-600",
    confirmButton: "bg-red-600 text-white hover:bg-red-700",
  },
  warning: {
    icon: AlertTriangle,
    iconBox: "bg-yellow-50 text-yellow-600",
    confirmButton: "bg-yellow-500 text-white hover:bg-yellow-600",
  },
  success: {
    icon: CheckCircle2,
    iconBox: "bg-green-50 text-green-600",
    confirmButton: "bg-green-600 text-white hover:bg-green-700",
  },
  info: {
    icon: Info,
    iconBox: "bg-blue-50 text-blue-600",
    confirmButton: "bg-blue-600 text-white hover:bg-blue-700",
  },
};

function ConfirmModal() {
  const { confirmState, handleConfirm, handleCancel } = useConfirm();

  if (!confirmState.isOpen) {
    return null;
  }

  const { title, message, confirmText, cancelText, type } =
    confirmState.options;

  const config = modalConfig[type] || modalConfig.default;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.iconBox}`}>
            <Icon size={26} />
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className={`rounded-xl px-5 py-3 text-sm font-semibold ${config.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
