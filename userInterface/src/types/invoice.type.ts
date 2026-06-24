export interface Invoice {
  id: string;
  storeId?: string | null;
  petName: string | null;
  appointmentNote: string | null;
  customerName: string | null;
  customerId?: string;
  customerEmail?: string;
  customer?: {
    id?: string;
    email?: string;
    name?: string;
    userName?: string;
  };
  totalAmount: number;
  status: string;
  payOsOrderCode: number | null;
  createdAt: string;
}

//api request invoice
export interface CreateInvoice {
  storeId?: string | null;
  petId?: string | null;
  appointmentId?: string | null;
  customerId?: string | null;
  details?: CreateInvoiceDetail[] | null;
}

//api response invoice
export type GetAllInvoicesResponse = Invoice;
export type GetInvoiceByIdResponse = Invoice;
export type GetInvoiceByCustomerIdResponse = Invoice;

//api invocie detail
export interface InvoiceDetail {
  id: string;
  itemName?: string;
  name?: string;
  price?: number;
  quantity?: number;
  subtotal?: number;
  total?: number;
  [key: string]: unknown;
}
export interface GetInvoiceDetailsResponse {
  id: string;
  itemName?: string;
  name?: string;
  price?: number;
  quantity?: number;
  subtotal?: number;
  total?: number;
  [key: string]: unknown;
}
export interface CreateInvoiceDetail {
  itemId?: string | null;
  quantity: number;
}
