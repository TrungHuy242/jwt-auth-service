import { createContext, useContext, useEffect, useState } from "react";
import { notificationApi } from "../api/notificationApi";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated, hasPermission } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const loadUnreadCount = async () => {
    if (!isAuthenticated || !hasPermission("notifications.view")) {
      setUnreadCount(0);
      return;
    }

    try {
      setNotificationLoading(true);

      const response = await notificationApi.getUnreadCount();

      setUnreadCount(response.unreadCount || response.count || 0);
    } catch (error) {
      setUnreadCount(0);
    } finally {
      setNotificationLoading(false);
    }
  };

  const decreaseUnreadCount = (amount = 1) => {
    setUnreadCount((prev) => Math.max(0, prev - amount));
  };

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    loadUnreadCount();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !hasPermission("notifications.view")) {
      return;
    }

    const intervalId = setInterval(() => {
      loadUnreadCount();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated, hasPermission]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        isAuthenticated &&
        hasPermission("notifications.view")
      ) {
        loadUnreadCount();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, hasPermission]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
        notificationLoading,
        loadUnreadCount,
        decreaseUnreadCount,
        resetUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }

  return context;
}
