export interface Pet {
  id: string;
  customerId: string;
  name: string;
  color: string;
  dateOfBirth: string;
  species?: string;
  type?: string;
  breed?: string;
  gender?: string;
  weight?: number | string;
  imageUrl?: string;
  avatarUrl?: string;
  photoUrl?: string;
  ownerName?: string;
  customerName?: string;
  customer?: {
    name?: string;
    fullName?: string;
    phone?: string;
    email?: string;
  };
  medicalNote?: string;
  note?: string;
  allergy?: string;
  allergies?: string;
  vaccineInfo?: string;
  vaccination?: string;
  contactInfo?: string;
  phone?: string;
  email?: string;
}

export type PetDetail = Pet;

export interface GetPetByIdResponse {
  data?: PetDetail;
  pet?: PetDetail;
}

export interface CreatePetRequest {
  customerId: string;
  name: string;
  species: string;
  color: string;
  dateOfBirth: string;
}
