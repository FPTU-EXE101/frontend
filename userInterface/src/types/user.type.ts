export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role?: string;
  plan: number;
  createdAt: string;
  updatedAt: string;
  emailConfirmed: boolean;
}
