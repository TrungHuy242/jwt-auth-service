import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../api/authApi";
import { tokenUtils } from "../utils/token";
import { AUTH_EVENTS, resetSessionExpiredFlag } from "../utils/authEvents";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    if (!tokenUtils.isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.getMe();
      resetSessionExpiredFlag();
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (error) {
      tokenUtils.clearTokens();
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();

    const handleSessionExpired = () => {
      tokenUtils.clearTokens();
      localStorage.removeItem("user");
      setUser(null);
    };

    window.addEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired);

    return () => {
      window.removeEventListener(AUTH_EVENTS.SESSION_EXPIRED, handleSessionExpired);
    };
  }, [loadCurrentUser]);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const { accessToken, refreshToken, user: userData } = response;
    tokenUtils.setTokens({ accessToken, refreshToken });
    resetSessionExpiredFlag();
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
    } finally {
      tokenUtils.clearTokens();
      resetSessionExpiredFlag();
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const permissions = user?.permissions || [];

  const hasPermission = (permissionKey) => {
    if (!permissionKey) return false;
    if (user?.role === "ADMIN") return true;
    return permissions.includes(permissionKey);
  };

  const hasAnyPermission = (permissionKeys = []) => {
    if (user?.role === "ADMIN") return true;
    return permissionKeys.some((permissionKey) =>
      permissions.includes(permissionKey)
    );
  };

  const hasAllPermissions = (permissionKeys = []) => {
    if (user?.role === "ADMIN") return true;
    return permissionKeys.every((permissionKey) =>
      permissions.includes(permissionKey)
    );
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
    loadCurrentUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
