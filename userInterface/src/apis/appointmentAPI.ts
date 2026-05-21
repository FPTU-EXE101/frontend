import type { CreateAppointmentRequest } from "@/types/appointment.type";
import type { AppointmentStatus } from "@/types/enum.type";
import axiosClient from "./axiosClient";

const APPOINTMENTS_API_URL = "/appointments";
const APPOINTMENT_API_URL = "/appointment";
const CREATE_APPOINTMENT_URL = "/appointment/";
const appointmentApi = {
  getAllAppointments: () => axiosClient.get(`${APPOINTMENTS_API_URL}`),
  getAppointmentById: (id: string) =>
    axiosClient.get(`${APPOINTMENT_API_URL}/${id}`),
  createAppointment: (data: CreateAppointmentRequest) =>
    axiosClient.post(`${CREATE_APPOINTMENT_URL}`, data),
  updateAppointment: (
    id: string,
    data: Partial<CreateAppointmentRequest> & { status?: AppointmentStatus },
  ) =>
    axiosClient.patch(`${APPOINTMENT_API_URL}/${id}`, data),
  deleteAppointment: (id: string) =>
    axiosClient.delete(`${APPOINTMENT_API_URL}/${id}`),
  getAppointmentsByCustomerId: (customerId: string) =>
    axiosClient.get(`${APPOINTMENTS_API_URL}/customer/${customerId}`),
  getAppointmentsByPetId: (petId: string) =>
    axiosClient.get(`${APPOINTMENTS_API_URL}/pet/${petId}`),
};
export default appointmentApi;
