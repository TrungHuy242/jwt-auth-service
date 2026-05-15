import { AlertTriangle } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

function MaintenanceBanner() {
  const { settings } = useSettings();

  if (!settings.maintenanceMode) {
    return null;
  }

  return (
    <div className="mb-4 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-800">
      <div className="flex items-start gap-3">
        <AlertTriangle size={20} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">Hệ thống đang ở chế độ bảo trì</p>
          <p className="mt-1 text-sm">
            Một số chức năng có thể bị hạn chế. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceBanner;
