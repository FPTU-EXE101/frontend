import type { AppointmentStatus, ReminderStatus } from "@/types/enum.type";
import type { AppointmentFormState } from "./types";

export const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

export const DEFAULT_FORM: AppointmentFormState = {
  customerId: "",
  petId: "",
  appointmentDate: "",
  startTime: "",
  endTime: "",
  appointmentNote: "",
  reminderTime: "",
  reminderStatus: 0,
};

export const statusMeta: Record<
  AppointmentStatus,
  { label: string; badge: string; dot: string }
> = {
  0: {
    label: "Đã xác nhận",
    badge: "bg-sky-50 text-sky-700 border-sky-100",
    dot: "bg-sky-500",
  },
  1: {
    label: "Hoàn thành",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
  },
  2: {
    label: "Đã hủy",
    badge: "bg-zinc-100 text-zinc-700 border-zinc-200",
    dot: "bg-zinc-500",
  },
};

export const reminderStatusLabel: Record<ReminderStatus, string> = {
  0: "Đang chờ",
  1: "Đã gửi",
  2: "Thất bại",
};
