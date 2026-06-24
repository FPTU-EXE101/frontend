import type { Items } from "@/types/item.type";

export type POSItem = Items;

export type CartItem = {
  item: POSItem;
  quantity: number;
};

export type AppointmentPOS = {
  id: string;
  petId: string;
  storeId?: string | null;
  petName: string;
  customerId: string;
  customerName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: number | string;
  appointmentNote?: string;
  paymentStatus?: string;
};

export type PaymentSummary = {
  subtotal: number;
  vat: number;
  total: number;
};

export type PaymentLocationState = {
  appointmentId?: string;
  customerId?: string;
  petId?: string;
};

export type InvoiceCreateResponseData = {
  id?: string;
  data?: {
    id?: string;
  };
};
