export interface Pet {
  id: string;
  customerId: string;
  name: string;
  color: string;
  dateOfBirth: string;
}
export interface CreatePetRequest {
  customerId: string;
  name: string;
  species: string;
  color: string;
  dateOfBirth: string;
}
