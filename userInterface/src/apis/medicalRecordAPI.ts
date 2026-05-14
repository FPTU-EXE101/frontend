import type { CreateMedicalRecordRequest } from "@/types/medicalRecord.type";
import axiosClient from "./axiosClient";

const MEDICAL_RECORD_API_URL = "/MedicalRecord";

const medicalRecordApi = {
  getAllMedicalRecords: () => axiosClient.get(`${MEDICAL_RECORD_API_URL}`),
  getMedicalRecordById: (id: string) =>
    axiosClient.get(`${MEDICAL_RECORD_API_URL}/${id}`),
  createMedicalRecord: (data: CreateMedicalRecordRequest) =>
    axiosClient.post(`${MEDICAL_RECORD_API_URL}`, data),
  updateMedicalRecord: (
    id: string,
    data: Partial<CreateMedicalRecordRequest>,
  ) => axiosClient.patch(`${MEDICAL_RECORD_API_URL}/${id}`, data),
  deleteMedicalRecord: (id: string) =>
    axiosClient.delete(`${MEDICAL_RECORD_API_URL}/${id}`),
};
export default medicalRecordApi;
