import type {
  CreateInvoice,
  GetAllInvoicesResponse,
  GetInvoiceByIdResponse,
  GetInvoiceByCustomerIdResponse,
  GetInvoiceDetailsResponse,
} from "@/types/invoice.type";
import type { AxiosRequestConfig } from "axios";
import axiosClient from "./axiosClient";

const INVOICE_API_URL = "/invoice";

const invoiceApi = {
  getAllInvoices: (config?: AxiosRequestConfig) =>
    axiosClient.get<GetAllInvoicesResponse[]>(INVOICE_API_URL, config),

  createInvoice: (data: CreateInvoice) =>
    axiosClient.post<GetInvoiceByIdResponse>(INVOICE_API_URL, data),

  getInvoiceById: (id: string) =>
    axiosClient.get<GetInvoiceByIdResponse>(`${INVOICE_API_URL}/${id}`),

  getInvoiceByCustomerId: (customerId: string, config?: AxiosRequestConfig) =>
    axiosClient.get<GetInvoiceByCustomerIdResponse[]>(
      `${INVOICE_API_URL}/customer/${customerId}`,
      config,
    ),

  getInvoiceDetails: (id: string) =>
    axiosClient.get<GetInvoiceDetailsResponse[]>(
      `${INVOICE_API_URL}/invoice-detail/${id}`,
    ),

  confirmInvoice: (id: string) =>
    axiosClient.patch<GetInvoiceByIdResponse>(
      `${INVOICE_API_URL}/confirm-transaction/${id}`,
    ),
};

export default invoiceApi;
