import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

import { BASE_URL } from "../constants/baseUrl";

export const $api = axios.create({
  baseURL: `${(BASE_URL || "").replace(/\/$/, "")}/api/v1`,
  responseType: "json",
});

const getLocaleCookie = () => {
  if (typeof window !== "undefined") {
    const match = document.cookie.match(new RegExp("(^| )locale=([^;]+)"));
    return match ? match[2] : null;
  }
  return null;
};

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const lang = getLocaleCookie() || "ru";

  if (config.headers) {
    config.headers["Accept-Language"] = lang;
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return config;
});

$api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (AxiosRequestConfig & { _isRetry?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await axios.post(
            `${(BASE_URL || "").replace(/\/$/, "")}/api/v1/auth/refresh/`,
            {
              refresh: refreshToken,
            },
          );

          const newAccessToken = response.data.access;
          localStorage.setItem("access_token", newAccessToken);
          if (response.data.refresh) {
            localStorage.setItem("refresh_token", response.data.refresh);
          }

          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] =
              `Bearer ${newAccessToken}`;
          }
          return $api.request(originalRequest);
        }
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_type");
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
    }

    const customError = new Error(
      (error.response?.data as { message?: string })?.message || error.message,
    ) as Error & {
      status?: number;
      errors?: unknown;
      data?: unknown;
      response?: typeof error.response;
    };
    customError.status = error.response?.status;
    customError.errors = (error.response?.data as { errors?: unknown })?.errors;
    customError.data = error.response?.data;
    customError.response = error.response;
    return Promise.reject(customError);
  },
);

export default $api;
