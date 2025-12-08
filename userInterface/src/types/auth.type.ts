export interface Register {
  username: string;
  password: string;
  phoneNumber: number;
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
