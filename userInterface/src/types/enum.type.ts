export type AppointmentStatus = "confirmed" | "completed" | "cancelled";
export type ItemType = "service" | "product" | 0 | 1; // service = 0, product = 1
export type PaymentStatus = "pending" | "completed" | "cancelled" | "failed";
export type ReminderStatus = "pending" | "sent" | "failed";
export type UserRole = "customer" | "manager" | "admin";
export type PlanType = "free" | "premium";
