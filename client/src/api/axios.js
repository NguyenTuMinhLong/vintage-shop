import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const isLocalhostApi =
  configuredApiUrl?.includes("localhost") || configuredApiUrl?.includes("127.0.0.1");

export const api = axios.create({
  // If someone accidentally builds the client with a localhost API URL, fall back to
  // relative `/api` so the deployed site works without rebuilding env files.
  baseURL: configuredApiUrl && !isLocalhostApi ? configuredApiUrl : "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
