import type { CreateItemRequest, Items } from "@/types/item.type";
import type { AxiosRequestConfig } from "axios";
import axiosClient from "./axiosClient";

const ITEM_API_URL = "/items";
const isServiceType = (type: unknown): boolean => {
  const typeValue = String(type).toLowerCase();
  return typeValue === "service" || typeValue === "0";
};

const itemApi = {
  getAllItems: (config?: AxiosRequestConfig) =>
    axiosClient.get(`${ITEM_API_URL}/item`, config),
  getAllServices: async (config?: AxiosRequestConfig) => {
    const response = await axiosClient.get<Items[]>(
      `${ITEM_API_URL}/item`,
      config,
    );
    return {
      ...response,
      data: Array.isArray(response.data)
        ? response.data.filter((item) => isServiceType(item?.type))
        : response.data,
    };
  },
  getItemById: (id: string) => axiosClient.get(`${ITEM_API_URL}/${id}`),
  createItem: (data: CreateItemRequest | FormData) =>
    axiosClient.post(
      `${ITEM_API_URL}`,
      data,
      data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined,
    ),
  updateItem: (id: string, data: CreateItemRequest | FormData) =>
    axiosClient.put(
      `${ITEM_API_URL}/${id}`,
      data,
      data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined,
    ),
  deleteItem: (id: string) => axiosClient.delete(`${ITEM_API_URL}/${id}`),
};
export default itemApi;
