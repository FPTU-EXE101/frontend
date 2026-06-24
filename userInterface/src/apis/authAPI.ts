import type {
  ChangePassword,
  JoinStore,
  Login,
  Register,
  RegisterManager,
} from "../types/auth.type";
import axiosClient from "./axiosClient";

const USER_API_URL = "/auth";
// const getConfirmEmailUrl = (): string => {
//   const confirmEmailUrl = import.meta.env.VITE_CONFIRM_EMAIL_URL;

//   if (!confirmEmailUrl) {
//     throw new Error("Missing VITE_CONFIRM_EMAIL_URL environment variable.");
//   }

//   return confirmEmailUrl;
// };

const authApi = {
  registerUser: (data: Register) =>
    axiosClient.post(`${USER_API_URL}/register`, data),
  registerManager: (data: RegisterManager) =>
    axiosClient.post(`${USER_API_URL}/registermanager`, data),
  loginUser: (data: Login) => axiosClient.post(`${USER_API_URL}/login`, data),
  joinStore: (data: JoinStore) =>
    axiosClient.post(`${USER_API_URL}/join-store`, data),
  changePassword: (data: ChangePassword) =>
    axiosClient.patch(`${USER_API_URL}/changePassword`, data),
  confirmEmail: (data: { userId: string; token: string }) =>
    axiosClient.get(`${USER_API_URL}/confirm-email`, {
      params: data,
    }),
};
export default authApi;
