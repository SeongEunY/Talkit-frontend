import axios from "axios";
import { ERROR_ROUTES } from "../constants/route";

let store = null;
let logoutAction = null;
let isRefreshing = false;
let refreshSubscribers = [];

export const initializeStore = (reduxStore, logout) => {
  store = reduxStore;
  logoutAction = logout;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_HOST,
  withCredentials: true,
});

const hasRefreshToken = () => {
  return document.cookie.split("; ").some((row) => row.startsWith("refresh"));
};

const dispatchLogout = () => {
  if (store && logoutAction) {
    store.dispatch(logoutAction());
  }
};

// 토큰 재발급이 완료된 후 기존 요청들을 재시도
const onRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

const removeAccessAndRefreshFromCookie = () => {
  document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// 토큰 재발급 실패 시 대기 중인 요청들을 reject
const onRefreshError = (error) => {
  refreshSubscribers.forEach((callback) => callback(error));
  refreshSubscribers = [];
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {
    if (!config.url?.includes("/api/auth/reissue")) {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access"))
        ?.split("=")[1];

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!hasRefreshToken()) {
        const publicPaths = ["/", "/login", "/signup"];
        if (!publicPaths.includes(window.location.pathname)) {
          window.location.href = "/";
        }
        return Promise.reject(error);
      }

      // 액세스 토큰 재발급
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await axiosInstance.post("/api/auth/reissue");
          isRefreshing = false;
          onRefreshed();
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          onRefreshError(refreshError);
          if (refreshError.response?.status === 401) {
            dispatchLogout();
            removeAccessAndRefreshFromCookie();

            if (
              !Object.values(ERROR_ROUTES).includes(window.location.pathname)
            ) {
              window.location.href = ERROR_ROUTES.LOGIN_EXPIRED;
            }
          }
          return Promise.reject(refreshError);
        }
      }

      // 재발급 진행 중일 때의 요청 처리
      return new Promise((resolve, reject) => {
        refreshSubscribers.push((error) => {
          if (error) {
            reject(error);
          } else {
            resolve(axiosInstance(originalRequest));
          }
        });
      });
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
