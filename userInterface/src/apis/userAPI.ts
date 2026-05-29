import type { UserProfileUpdateValues } from "../types/userProfile.type";
import type { AxiosRequestConfig } from "axios";
import axiosClient from "./axiosClient";

const USER_API_URL = "/user";
const USERS_API_URL = "/users";
const userApi = {
  getAllUsers: (config?: AxiosRequestConfig) =>
    axiosClient.get(`${USERS_API_URL}`, config),
  getUserById: (id: string, config?: AxiosRequestConfig) =>
    axiosClient.get(`${USER_API_URL}/${id}`, config),
  updateUser: (id: string, data: UserProfileUpdateValues) =>
    axiosClient.put(`${USER_API_URL}/${id}`, data),
  deleteUser: (id: string) => axiosClient.delete(`${USER_API_URL}/${id}`),
};
export default userApi;
