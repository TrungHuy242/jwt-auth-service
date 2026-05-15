import { useSettings } from "../../context/SettingsContext";

function AppBrand({ size = "md", showSubtitle = false }) {
  const { settings } = useSettings();

  const logoSize = size === "lg" ? "h-14 w-14" : "h-10 w-10";
  const textSize = size === "lg" ? "text-2xl" : "text-lg";

  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center justify-center gap-3">
        {settings.siteLogo ? (
          <img
            src={settings.siteLogo}
            alt={settings.siteName}
            className={`${logoSize} rounded-2xl object-cover`}
          />
        ) : (
          <div
            className={`${logoSize} flex items-center justify-center rounded-2xl bg-blue-600 font-bold text-white`}
          >
            {settings.siteName?.charAt(0)?.toUpperCase() || "F"}
          </div>
        )}

        <h1 className={`${textSize} font-bold text-slate-900`}>
          {settings.siteName || "Full-stack Auth Core"}
        </h1>
      </div>

      {showSubtitle && (
        <p className="mt-3 text-sm text-slate-500">
          Full-stack Admin Starter Kit
        </p>
      )}
    </div>
  );
}

export default AppBrand;
