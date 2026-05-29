import type { CreateAppointmentRequest } from "@/types/appointment.type";
import type { AppointmentStatus } from "@/types/enum.type";
import type { AxiosRequestConfig } from "axios";
import axiosClient from "./axiosClient";

const APPOINTMENTS_API_URL = "/appointments";
const APPOINTMENT_API_URL = "/appointment";
const CREATE_APPOINTMENT_URL = "/appointment/";
const appointmentApi = {
  getAllAppointments: (config?: AxiosRequestConfig) =>
    axiosClient.get(`${APPOINTMENTS_API_URL}`, config),
  getAppointmentById: (id: string, config?: AxiosRequestConfig) =>
    axiosClient.get(`${APPOINTMENT_API_URL}/${id}`, config),
  createAppointment: (data: CreateAppointmentRequest) =>
    axiosClient.post(`${CREATE_APPOINTMENT_URL}`, data),
  updateAppointment: (
    id: string,
    data: Partial<CreateAppointmentRequest> & { status?: AppointmentStatus },
  ) =>
    axiosClient.patch(`${APPOINTMENT_API_URL}/${id}`, data),
  deleteAppointment: (id: string) =>
    axiosClient.delete(`${APPOINTMENT_API_URL}/${id}`),
  getAppointmentsByCustomerId: (
    customerId: string,
    config?: AxiosRequestConfig,
  ) => axiosClient.get(`${APPOINTMENTS_API_URL}/customer/${customerId}`, config),
  getAppointmentsByPetId: (petId: string, config?: AxiosRequestConfig) =>
    axiosClient.get(`${APPOINTMENTS_API_URL}/pet/${petId}`, config),
};
export default appointmentApi;
