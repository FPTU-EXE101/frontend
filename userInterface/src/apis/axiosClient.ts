import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to request headers if it exists in localStorage
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error", error);
    throw error;
  },
);
export default axiosClient;
