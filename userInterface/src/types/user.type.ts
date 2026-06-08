export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role?: string;
  plan: number;
  createAt: string;
  updateAt: string;
  emailConfirmed: boolean;
}
