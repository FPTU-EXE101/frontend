import type { CreatePetRequest } from "@/types/pet.type";
import axiosClient from "./axiosClient";

const PET_API_URL = "/pet";
const PETS_API_URL = "/pets";
const petApi = {
  getAllPets: () => axiosClient.get(`${PETS_API_URL}`),
  getPetById: (id: string) => axiosClient.get(`${PET_API_URL}/${id}`),
  getPetByCustomerId: (customerId: string) =>{
    return axiosClient.get(`${PETS_API_URL}/customer/${customerId}`)
  },
  createPet: (data: CreatePetRequest) =>
    axiosClient.post(`${PET_API_URL}`, data),
  updatePet: (id: string, data: FormData) =>
    axiosClient.patch(`${PET_API_URL}/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deletePet: (id: string) => axiosClient.delete(`${PET_API_URL}/${id}`),
};
export default petApi;
