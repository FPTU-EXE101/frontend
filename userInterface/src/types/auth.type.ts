export interface Register {
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
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
