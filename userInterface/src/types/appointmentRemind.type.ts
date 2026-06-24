import type { ReminderStatus } from "./enum.type";

export interface AppointmentRemind {
  id: string;
  appointmentId: string | null;
  reminderTime: string;
  status: ReminderStatus;
  createdAt: string;
}
export interface CreateAppointmentRemind {
  appointmentId?: string | null;
  reminderTime: string;
}
export interface UpdateAppointmentRemind {
  appointmentId?: string | null;
  reminderTime: string;
  status: ReminderStatus;
}
