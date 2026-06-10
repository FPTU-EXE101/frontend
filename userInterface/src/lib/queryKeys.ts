export const queryKeys = {
  managerAppointments: ["manager", "appointments"] as const,
  managerUsers: ["manager", "users"] as const,
  services: ["services"] as const,
  petAppointments: (petId: string) => ["pet", petId, "appointments"] as const,
  userAppointments: (userId: string) =>
    ["user", userId, "appointments"] as const,
  userInvoices: (userId: string) => ["user", userId, "invoices"] as const,
  userInvoice: (invoiceId: string) => ["user", "invoice", invoiceId] as const,
  userPets: (userId: string) => ["user", userId, "pets"] as const,
  customerProfile: (userId: string) => ["customer", userId, "profile"] as const,
};
