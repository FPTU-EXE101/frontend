import type { CreateItemRequest } from "@/types/item.type";
import axiosClient from "./axiosClient";

const ITEM_API_URL = "/Items";

const itemApi = {
  getAllItems: () => axiosClient.get(`${ITEM_API_URL}`),
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
    axiosClient.patch(
      `${ITEM_API_URL}/${id}`,
      data,
      data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined,
    ),
  deleteItem: (id: string) => axiosClient.delete(`${ITEM_API_URL}/${id}`),
};
export default itemApi;
