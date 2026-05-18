import type { CreateInvoice } from "@/types/invoice.type";
import axiosClient from "./axiosClient";

const INVOICE_API_URL = "/invoice";

const invoiceApi = {
    getAllInvoices: () => axiosClient.get(`${INVOICE_API_URL}`),
    createInvoice: (data: CreateInvoice) => axiosClient.post(`${INVOICE_API_URL}`, data),
    getInvoiceById: (id: string) => axiosClient.get(`${INVOICE_API_URL}/${id}`),
    getInvoiceByCustomerId: (customerId: string) => axiosClient.get(`${INVOICE_API_URL}/customer/${customerId}`),
    getInvoiceDetails: (id: string) => axiosClient.get(`${INVOICE_API_URL}/invoice/${id}`),
}
export default invoiceApi;