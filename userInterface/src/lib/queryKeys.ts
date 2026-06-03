export const queryKeys = {
  managerAppointments: ["manager", "appointments"] as const,
  managerUsers: ["manager", "users"] as const,
  services: ["services"] as const,
  petAppointments: (petId: string) => ["pet", petId, "appointments"] as const,
  userAppointments: (userId: string) =>
    ["user", userId, "appointments"] as const,
  userPets: (userId: string) => ["user", userId, "pets"] as const,
  customerProfile: (userId: string) => ["customer", userId, "profile"] as const,
};
