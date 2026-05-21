import type { Appointment } from "@/types/appointment.type";
import type { CreateInvoiceDetail } from "@/types/invoice.type";
import type { POSItem, CartItem, PaymentSummary } from "../types/payment.type";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  currency: "VND",
  maximumFractionDigits: 0,
  style: "currency",
});

export const formatCurrency = (value: number) =>
  currencyFormatter.format(value).replace("₫", "đ");

export const normalizeList = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (
    value &&
    typeof value === "object" &&
    "data" in value &&
    Array.isArray((value as { data: unknown }).data)
  ) {
    return (value as { data: T[] }).data;
  }
  return [];
};

export const getItemTypeLabel = (type: POSItem["type"]) =>
  type === 0 || type === "service" ? "Dịch vụ" : "Sản phẩm";

export const isServiceItem = (item: POSItem) =>
  item.type === 0 || item.type === "service";

export const isProductItem = (item: POSItem) =>
  item.type === 1 || item.type === "product";

export const calculateSubtotal = (cartItem: CartItem) =>
  cartItem.item.price * cartItem.quantity;

export const calculateTotal = (cartItems: CartItem[]): PaymentSummary => {
  const subtotal = cartItems.reduce(
    (total, cartItem) => total + calculateSubtotal(cartItem),
    0,
  );

  return {
    subtotal,
    total: subtotal,
    vat: 0,
  };
};

export const mapCartToCreateInvoiceDetails = (
  cartItems: CartItem[],
): CreateInvoiceDetail[] =>
  cartItems.map((cartItem) => ({
    itemId: cartItem.item.id,
    quantity: cartItem.quantity,
  }));

export const formatAppointmentDate = (value: string) => {
  if (!value) return "Chưa rõ thời gian";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const toAppointmentDateTime = (appointment: Appointment) => {
  const date = appointment.appointmentDate;
  const time = appointment.startTime;

  if (!date) return time || "";
  if (!time) return date;
  if (date.includes("T")) return date;

  return `${date}T${time}`;
};

export const toDateOnly = (value: string) => {
  if (!value) return "";
  return value.split("T")[0];
};

export const getStatusLabel = (status: number | string) => {
  if (status === 0 || status === "pending" || status === "confirmed") {
    return "Chưa thanh toán";
  }
  if (status === 1 || status === "completed") return "Chờ thanh toán";
  return String(status);
};

export const isConfirmedAppointment = (
  appointment: Appointment | { status: number | string },
) => appointment.status === 0 || appointment.status === "confirmed";

export const getInvoiceAppointmentId = (invoice: unknown) => {
  if (!invoice || typeof invoice !== "object") return "";

  const data = invoice as {
    appointment?: { id?: string };
    appointmentId?: string;
    appointmentNode?: string;
  };

  return data.appointmentId || data.appointment?.id || data.appointmentNode || "";
};

export const getInvoiceId = (value: unknown) => {
  if (value && typeof value === "object" && "id" in value) {
    return String((value as { id?: string }).id ?? "");
  }
  if (
    value &&
    typeof value === "object" &&
    "data" in value &&
    (value as { data?: unknown }).data &&
    typeof (value as { data?: unknown }).data === "object" &&
    "id" in ((value as { data?: unknown }).data as Record<string, unknown>)
  ) {
    return String(
      (((value as { data?: unknown }).data as { id?: string }).id ?? ""),
    );
  }
  return "";
};
