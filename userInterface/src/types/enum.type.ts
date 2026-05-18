export type AppointmentStatus = 0 | 1 | 2; // 0 = confirmed, 1 = completed, 2 = cancelled
export type ItemType = "service" | "product" | 0 | 1; // service = 0, product = 1
export type PaymentStatus = "pending" | "completed" | "cancelled" | "failed";
export type ReminderStatus = 0 |1|2 // 0= pending , 1 = sent | 2= failed; 
export type UserRole = "customer" | "manager" | "admin";
export type PlanType = "free" | "premium";
