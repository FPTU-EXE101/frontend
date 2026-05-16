import type { AppointmentStatus } from "./enum.type";


export interface Appointment {
  id: string;
  customerId: string;
  petId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  appointmentNote: string;
  status: AppointmentStatus;
  createAt: string;
  updateAt: string;
}
export interface CreateAppointmentRequest {
  customerId: string;
  petId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  appointmentNote: string;
}
