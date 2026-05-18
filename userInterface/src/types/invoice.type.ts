export interface Invoice {
  id: string;
  petName: string;
  appointmentNode: string;
  customerName: string;
  totalAmount: number;
  createAt: Date;
}
export interface CreateInvoice {
  petId: string;
  appointmentId: string;
  customerId: string;
  details: CreateInvoiceDetail[];
}
export interface InvoiceDetail {
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
