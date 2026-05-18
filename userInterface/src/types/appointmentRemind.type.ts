import type { ReminderStatus } from "./enum.type"

export interface AppointmentRemind{
    id: string
    appointmentId: string
    reminderTime: string
    status: ReminderStatus
    createAt: Date
}
export interface CreateAppointmentRemind{
    appointmentId: string
    reminderTime: string
}
export interface UpdateAppointmentRemind{
    appointmentId: string
    reminderTime: string
    status: ReminderStatus
}