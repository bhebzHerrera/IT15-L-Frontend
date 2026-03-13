import axios from "axios";

const AUTH_TOKEN_KEY = "enrollment_frontend_token";
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://localhost:8000/api";

const apiClient = axios.create({
  baseURL: configuredBaseUrl,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

if (
  import.meta.env.PROD &&
  configuredBaseUrl.startsWith("http://") &&
  !configuredBaseUrl.includes("localhost")
) {
  console.warn("VITE_API_BASE_URL should use HTTPS in production.");
}

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
