import type { AppointmentStatus } from "./enum.type";


export interface Appointment {
  id: string;
  customerId: string;
  petId: string;
  storeId?: string | null;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  appointmentNote: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}
export interface CreateAppointmentRequest {
  customerId: string;
  petId: string;
  appointmentDate: string; //string($date)
  startTime: string; //string($time)
  endTime: string; //string($time)
  appointmentNote: string;
}
