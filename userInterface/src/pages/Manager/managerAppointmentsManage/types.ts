import type { CreateAppointmentRequest } from "@/types/appointment.type";
import type { AppointmentStatus, ReminderStatus } from "@/types/enum.type";

export type StatusFilter = AppointmentStatus | "all";

export type AppointmentFormState = CreateAppointmentRequest & {
  id?: string;
  reminderId?: string;
  reminderTime: string;
  reminderStatus: ReminderStatus;
};

