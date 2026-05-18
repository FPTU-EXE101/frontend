import type { CreateAppointmentRemind, UpdateAppointmentRemind } from "@/types/appointmentRemind.type";
import axiosClient from "./axiosClient";
const REMINDERS_API_URL = "/reminds"
const REMINDER_API_URL = "/remind"

const reminderApi = {
    getAllReminders: () => axiosClient.get(`${REMINDERS_API_URL}`),
    getReminderById: (id: string) => axiosClient.get(`${REMINDER_API_URL}/${id}`),
    updateReminder:(id: string, data: UpdateAppointmentRemind) => axiosClient.patch(`${REMINDER_API_URL}/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
    deleteReminder:(id: string)=> axiosClient.delete(`${REMINDER_API_URL}/${id}`),
    getReminderByAppoinmentId: (id: string) => axiosClient.get(`${REMINDER_API_URL}/appointment/${id}`),
    createRemind: (data: CreateAppointmentRemind)=> axiosClient.post(`${REMINDER_API_URL}`, data)
}
export default reminderApi