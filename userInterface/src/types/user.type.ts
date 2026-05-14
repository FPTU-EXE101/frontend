import type { UserRole } from "./enum.type";

export interface User {
  email: string;
  fullName: string;
  role: UserRole;
  status: string;
}
