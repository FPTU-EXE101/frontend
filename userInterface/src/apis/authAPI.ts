import type { ChangePassword, Login, Register } from "../types/auth.type";
import axiosClient from "./axiosClient";

const USER_API_URL = "/auth";

const authApi = {
  registerUser: (data: Register) =>
    axiosClient.post(`${USER_API_URL}/register`, data),
  loginUser: (data: Login) => axiosClient.post(`${USER_API_URL}/login`, data),
  changePassword: (data: ChangePassword) =>
    axiosClient.patch(`${USER_API_URL}/changePassword`, data),
};
export default authApi;