import axios from "axios";

const AUTH_TOKEN_KEY = "enrollment_frontend_token";
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://localhost:8000/api";

function resolveBaseUrl(rawUrl) {
  const parsedUrl = new URL(rawUrl);
  const isLocalHost = ["localhost", "127.0.0.1"].includes(parsedUrl.hostname);

  if (parsedUrl.protocol === "http:" && !isLocalHost) {
    // Enforce HTTPS on remote API calls to satisfy transport security requirements.
    parsedUrl.protocol = "https:";
  }

  return parsedUrl.toString().replace(/\/$/, "");
}

const baseUrl = resolveBaseUrl(configuredBaseUrl);

const apiClient = axios.create({
  baseURL: baseUrl,
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
  console.warn("VITE_API_BASE_URL was upgraded to HTTPS for security.");
}

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
