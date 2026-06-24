import type { CreateAppointmentRemind, UpdateAppointmentRemind } from "@/types/appointmentRemind.type";
import type { AxiosRequestConfig } from "axios";
import axiosClient from "./axiosClient";
const REMINDERS_API_URL = "/reminds"
const REMINDER_API_URL = "/remind"

const reminderApi = {
    getAllReminders: (config?: AxiosRequestConfig) => axiosClient.get(`${REMINDERS_API_URL}`, config),
    getReminderById: (id: string, config?: AxiosRequestConfig) => axiosClient.get(`${REMINDER_API_URL}/${id}`, config),
    updateReminder:(id: string, data: UpdateAppointmentRemind) => axiosClient.patch(`${REMINDER_API_URL}/${id}`, data),
    deleteReminder:(id: string)=> axiosClient.delete(`${REMINDER_API_URL}/${id}`),
    getReminderByAppoinmentId: (id: string) => axiosClient.get(`${REMINDER_API_URL}/appointment/${id}`),
    createRemind: (data: CreateAppointmentRemind)=> axiosClient.post(`${REMINDER_API_URL}`, data)
}
export default reminderApi
