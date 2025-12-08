import axios from "axios";
const BASE_URL = import.meta.env.BACKEND_URL;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error", error);
    throw error;
  }
);
export default axiosClient;