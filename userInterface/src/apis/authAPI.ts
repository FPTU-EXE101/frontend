import type { ChangePassword, Login, Register } from "../types/auth.type";
import axiosClient from "./axiosClient";

const USER_API_URL = "/Auth";
const getConfirmEmailUrl = (): string => {
  const confirmEmailUrl = import.meta.env.VITE_CONFIRM_EMAIL_URL;

  if (!confirmEmailUrl) {
    throw new Error("Missing VITE_CONFIRM_EMAIL_URL environment variable.");
  }

  return confirmEmailUrl;
};

const authApi = {
  registerUser: (data: Register) =>
    axiosClient.post(`${USER_API_URL}/register`, data),
  loginUser: (data: Login) => axiosClient.post(`${USER_API_URL}/login`, data),
  changePassword: (data: ChangePassword) =>
    axiosClient.patch(`${USER_API_URL}/changePassword`, data),
  confirmEmail: (data: { userId: string; token: string }) =>
    axiosClient.get(getConfirmEmailUrl(), {
      params: data,
    }),
};
export default authApi;
