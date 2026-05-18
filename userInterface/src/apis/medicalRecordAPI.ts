import type { CreateMedicalRecordRequest } from "@/types/medicalRecord.type";
import axiosClient from "./axiosClient";

const MEDICAL_RECORD_API_URL = "/medical_record";
const MEDICALS_RECORD_API_URL = "/medical_records"
const medicalRecordApi = {
  getAllMedicalRecords: () => axiosClient.get(`${MEDICALS_RECORD_API_URL}`),
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
  getMedicalRecordsByPetId: (id: string)=> axiosClient.get(`${MEDICALS_RECORD_API_URL}/pet/${id}`),
  getMedicalRecordByAppointmentId: (id: string) => axiosClient.get(`${MEDICALS_RECORD_API_URL}/appointment/${id}`)
};
export default medicalRecordApi;
