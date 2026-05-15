import { createContext, useContext, useEffect, useState } from "react";
import { settingApi } from "../api/settingApi";

const SettingsContext = createContext(null);

const defaultSettings = {
  siteName: "Full-stack Auth Core",
  siteLogo: "",
  allowRegister: true,
  allowGoogleLogin: true,
  allowFacebookLogin: true,
  maintenanceMode: false,
  supportEmail: "support@example.com",
  footerText: "Full-stack Auth Core \u00a9 2026",
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const loadPublicSettings = async () => {
    try {
      setSettingsLoading(true);

      const response = await settingApi.getPublicSettings();

      setSettings({
        ...defaultSettings,
        ...(response.settings || {}),
      });
    } catch (error) {
      setSettings(defaultSettings);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    loadPublicSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        settingsLoading,
        loadPublicSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}
