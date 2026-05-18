import type { CreateItemRequest } from "@/types/item.type";
import axiosClient from "./axiosClient";

const ITEM_API_URL = "/items";

const itemApi = {
  getAllItems: () => axiosClient.get(`${ITEM_API_URL}/item`),
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
