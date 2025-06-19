import axios from "axios";
import { authClient } from "../lib/auth/client";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "https://app-slplfms-prod.azurewebsites.net/v1/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("/api/refresh-token", {
          refreshToken,
        });
        const { token } = response.data;

        localStorage.setItem("auth-token", token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (error) {
        console.log(error);
        authClient.signOut();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
