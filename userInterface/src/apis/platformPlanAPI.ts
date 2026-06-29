import type { AxiosRequestConfig } from "axios";
import axiosClient from "./axiosClient";
import type {
  CreatePlatformPlan,
  PlatformPlan,
  UpdatePlatformPlan,
} from "@/types/platformPlan.type";

const PLATFORM_PLAN_API_URL = "/platformplan";

const platformPlanApi = {
  getAllPlatformPlans: (config?: AxiosRequestConfig) =>
    axiosClient.get<PlatformPlan[]>(PLATFORM_PLAN_API_URL, config),
  getPlatformPlanById: (id: string, config?: AxiosRequestConfig) =>
    axiosClient.get<PlatformPlan>(`${PLATFORM_PLAN_API_URL}/${id}`, config),
  createPlatformPlan: (data: CreatePlatformPlan, config?: AxiosRequestConfig) =>
    axiosClient.post<PlatformPlan>(PLATFORM_PLAN_API_URL, data, config),
  updatePlatformPlan: (
    id: string,
    data: UpdatePlatformPlan,
    config?: AxiosRequestConfig,
  ) => axiosClient.put(`${PLATFORM_PLAN_API_URL}/${id}`, data, config),
  deletePlatformPlan: (id: string, config?: AxiosRequestConfig) =>
    axiosClient.delete(`${PLATFORM_PLAN_API_URL}/${id}`, config),
};

export default platformPlanApi;
