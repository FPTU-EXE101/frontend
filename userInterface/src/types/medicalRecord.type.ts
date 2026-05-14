export interface MedicalRecord {
  id: string;
  petId: string;
  appointmentId: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  medicalRecordNote: string;
  createAt: string;
}
export interface CreateMedicalRecordRequest {
  petId: string;
  appointmentId: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  medicalRecordNote: string;
  createAt: string;
}
