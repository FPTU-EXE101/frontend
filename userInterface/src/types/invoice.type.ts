//api invocie
export interface Invoice {
  id: string;
  petName: string;
  appointmentNode: string;
  customerName: string;
  totalAmount: number;
  createAt: Date;
}
//api request invoice
export interface CreateInvoice {
  petId?: string;
  appointmentId?: string;
  customerId?: string;
  details: CreateInvoiceDetail[];
}

//api response invoice
export interface GetAllInvoicesResponse {
  id: string;
  petName: string;
  appointmentNode: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createAt: Date;
}
export interface GetInvoiceByIdResponse {
  id: string;
  petName: string;
  appointmentNode: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createAt: Date;
}
export interface GetInvoiceByCustomerIdResponse {
  id: string;
  petName: string;
  appointmentNode: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createAt: Date;
}

//api invocie detail
export interface InvoiceDetail {
  id: string;
  itemName: string;
  price: number;
  quantity: number;
  subtotal: number;
}
export interface GetInvoiceDetailsResponse {
  id: string;
  itemName: string;
  price: number;
  quantity: number;
  subtotal: number;
}
export interface CreateInvoiceDetail {
  itemId: string;
  quantity: number;
}
