import type { CreateAppointmentRequest } from "@/types/appoinment";
import axiosClient from "./axiosClient";

const APPOINTMENT_API_URL = "/Appointments";

const appointmentApi = {
  getAllAppointments: () => axiosClient.get(`${APPOINTMENT_API_URL}`),
  getAppointmentById: (id: string) =>
    axiosClient.get(`${APPOINTMENT_API_URL}/${id}`),
  createAppointment: (data: CreateAppointmentRequest) =>
    axiosClient.post(`${APPOINTMENT_API_URL}`, data),
  updateAppointment: (id: string, data: CreateAppointmentRequest) =>
    axiosClient.patch(`${APPOINTMENT_API_URL}/${id}`, data),
  deleteAppointment: (id: string) =>
    axiosClient.delete(`${APPOINTMENT_API_URL}/${id}`),
  getAppointmentsByCustomerId: (customerId: string) =>
    axiosClient.get(`${APPOINTMENT_API_URL}/customer/${customerId}`),
  getAppointmentsByPetId: (petId: string) =>
    axiosClient.get(`${APPOINTMENT_API_URL}/pet/${petId}`),
};
export default appointmentApi;
