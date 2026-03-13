import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../services/apiClient";

const AUTH_STORAGE_KEY = "enrollment_frontend_auth";
const AUTH_TOKEN_KEY = "enrollment_frontend_token";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const USE_REAL_AUTH = import.meta.env.VITE_USE_REAL_AUTH === "true";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const isExpired =
          parsedUser.expiresAt && Number(parsedUser.expiresAt) < Date.now();

        if (isExpired) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          localStorage.removeItem(AUTH_TOKEN_KEY);
          return;
        }

        if (savedToken) {
          apiClient.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
        }

        setUser(parsedUser);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }
  }, []);

  const login = async (credentials) => {
    const expiresAt = Date.now() + SESSION_DURATION_MS;

    if (USE_REAL_AUTH) {
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
    }

    const fallbackEmail = "enrollment@umtc.edu.ph";
    const email = credentials.email || fallbackEmail;
    const name = email.split("@")[0] || "Enrollment Officer";

    const mockUser = {
      id: 1,
      name,
      role: credentials.role || "User",
      email,
      expiresAt,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
    localStorage.setItem(AUTH_TOKEN_KEY, "mock-session-token");
    apiClient.defaults.headers.common.Authorization = "Bearer mock-session-token";
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    delete apiClient.defaults.headers.common.Authorization;
    setUser(null);
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
