import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../api/authApi";
import { tokenUtils } from "../utils/token";
import { AUTH_EVENTS } from "../utils/authEvents";

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
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // ignore logout API errors
    } finally {
      tokenUtils.clearTokens();
      localStorage.removeItem("user");
      setUser(null);
    }
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
