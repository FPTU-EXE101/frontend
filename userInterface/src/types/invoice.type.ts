export interface Invoice {
  id: string;
  petName: string;
  appointmentNote: string;
  customerName: string;
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
  payOsOrderCode: string | number | null;
  createdAt: string;
}

//api request invoice
export interface CreateInvoice {
  petId?: string;
  appointmentId?: string;
  customerId?: string;
  details: CreateInvoiceDetail[];
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
  itemId: string;
  quantity: number;
}
