export interface MedicalRecord {
  id: string;
  petId: string | null;
  appointmentId: string | null;
  diagnosis: string | null;
  treatment: string | null;
  prescription: string | null;
  medicalRecordNote: string | null;
  createdAt: string;
}
export interface CreateMedicalRecordRequest {
  petId?: string | null;
  appointmentId?: string | null;
  diagnosis?: string | null;
  treatment?: string | null;
  prescription?: string | null;
  medicalRecordNote?: string | null;
  createdAt: string;
}
