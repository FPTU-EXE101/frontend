import type { ChangePassword, Login, Register } from "../types/auth.type";
import axiosClient from "./axiosClient";

const USER_API_URL = "/Auth";

const authApi = {
  registerUser: (data: Register) =>
    axiosClient.post(`${USER_API_URL}/register`, data),
  loginUser: (data: Login) => axiosClient.post(`${USER_API_URL}/login`, data),
  changePassword: (data: ChangePassword) =>
    axiosClient.patch(`${USER_API_URL}/changePassword`, data),
  confirmEmail: (data: { userId: string; token: string }) =>
    axiosClient.get(`${USER_API_URL}/confirmEmail`, { params: data }),
};
export default authApi;