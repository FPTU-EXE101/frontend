import axiosClient from "./axiosClient";

const PET_API_URL = "/Pets";

const petApi = {
  getAllPets: () => axiosClient.get(`${PET_API_URL}`),
  getPetById: (id: string) => axiosClient.get(`${PET_API_URL}/${id}`),
  createPet: (data: FormData) =>
    axiosClient.post(`${PET_API_URL}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updatePet: (id: string, data: FormData) =>
    axiosClient.patch(`${PET_API_URL}/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deletePet: (id: string) => axiosClient.delete(`${PET_API_URL}/${id}`),
};
export default petApi;