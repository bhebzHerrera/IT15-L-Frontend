import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../services/apiClient";

const AUTH_STORAGE_KEY = "enrollment_frontend_auth";
const AUTH_TOKEN_KEY = "enrollment_frontend_token";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const clearAuthState = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    delete apiClient.defaults.headers.common.Authorization;
    setUser(null);
  };

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);

      if (!savedUser) {
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUser);
        const isExpired =
          parsedUser.expiresAt && Number(parsedUser.expiresAt) < Date.now();

        if (isExpired || !savedToken) {
          clearAuthState();
          return;
        }

        apiClient.defaults.headers.common.Authorization = `Bearer ${savedToken}`;

        const response = await apiClient.get("/me");
        const authenticatedUser = {
          ...response.data.data,
          expiresAt: parsedUser.expiresAt,
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));

        if (active) {
          setUser(authenticatedUser);
        }
      } catch {
        clearAuthState();
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = async (credentials) => {
    const expiresAt = Date.now() + SESSION_DURATION_MS;

    // Always reset stale session data before processing a new login attempt.
    clearAuthState();

    const response = await apiClient.post("/login", credentials);
    const authenticatedUser = {
      ...response.data.user,
      expiresAt,
    };
    const token = response.data.token;

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const logout = async () => {
    try {
      await apiClient.post("/logout");
    } catch {
      // Even if token revocation fails remotely, local session must still end.
    }

    clearAuthState();
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
