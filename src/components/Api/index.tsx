import axios from "axios";
import { toast } from "react-hot-toast";

export const AxiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

AxiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error(error.response?.data?.message || "An error occurred");
    return Promise.reject(error);
  }
);
