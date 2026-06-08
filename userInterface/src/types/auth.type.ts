export interface Register {
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}
export interface RegisterManager {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
export interface Login {
  email: string;
  password: string;
}
export interface ChangePassword {
  email: string;
  oldPassword: string;
  newPassword: string;
}
