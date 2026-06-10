import type { AxiosRequestConfig } from "axios";
import axiosClient from "./axiosClient";

const STORE_PACKAGE_API_URL = "/storepackage";
const STORE_PACKAGE_PAYMENT_API_URL = "/storePackage/payment";
const ITEM_API_URL = "/items";

export const PLANTEST_ITEM_ID = "ca52c739-fc77-40f8-beb0-7175fdb1d01e";
export const PLANTEST_ITEM_NAME = "Plantest";

export interface StorePackageRequest {
  managerId: string;
  itemId: string;
}

export interface StorePackageResponse {
  id: string;
  managerId: string;
  managerName: string;
  packageType: string;
  price: number;
  durationInDays: number;
  payOsOrderCode: string | null;
  status: string;
  paymentMethod: string;
  transactionNo: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface CreatePaymentRequest {
  packageId: string;
  buyerName: string;
  buyerEmail: string;
}

export interface CreatePaymentResponse {
  checkoutUrl: string;
}

export interface ItemResponse {
  id: string;
  name: string;
  price: number;
  type: number;
}

const storePackageApi = {
  getAllStorePackage: (config?: AxiosRequestConfig) =>
    axiosClient.get<StorePackageResponse[]>(STORE_PACKAGE_API_URL, config),
  getPackageItems: (config?: AxiosRequestConfig) =>
    axiosClient.get<ItemResponse[]>(`${ITEM_API_URL}/item`, config),
  createStorePackage: (request: StorePackageRequest) =>
    axiosClient.post<StorePackageResponse>(STORE_PACKAGE_API_URL, request),
  createStorePackagePayment: (request: CreatePaymentRequest) =>
    axiosClient.post<CreatePaymentResponse>(
      STORE_PACKAGE_PAYMENT_API_URL,
      request,
    ),
};

export default storePackageApi;
