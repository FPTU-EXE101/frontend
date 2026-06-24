import type { AxiosRequestConfig } from "axios";
import axiosClient from "./axiosClient";
import type { CustomerStore, Store, UpdateStore } from "@/types/store.type";

const CUSTOMER_STORES_API_URL = "/for-customer/stores";
const STORES_API_URL = "/stores";
const STORE_API_URL = "/store";

const storeApi = {
  getStoresForCustomer: (config?: AxiosRequestConfig) =>
    axiosClient.get<CustomerStore[]>(CUSTOMER_STORES_API_URL, config),
  getAllStores: (config?: AxiosRequestConfig) =>
    axiosClient.get<Store[]>(STORES_API_URL, config),
  getStoreById: (id: string, config?: AxiosRequestConfig) =>
    axiosClient.get<Store>(`${STORE_API_URL}/${id}`, config),
  updateStore: (id: string, data: UpdateStore, config?: AxiosRequestConfig) =>
    axiosClient.patch(`${STORE_API_URL}/${id}`, data, config),
};

export default storeApi;
