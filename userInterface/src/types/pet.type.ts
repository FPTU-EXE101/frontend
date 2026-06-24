export interface Pet {
  id: string;
  storeId?: string | null;
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
  storeId?: string | null;
  customerId: string;
  name?: string | null;
  species?: string | null;
  color?: string | null;
  dateOfBirth?: string | null;
}
