import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 1000,
});

api.interceptors.request.use(
  (config) => {
    config.headers.Authorization = localStorage.getItem("accessToken");
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    Promise.reject(error);
  }
);

export default api;
