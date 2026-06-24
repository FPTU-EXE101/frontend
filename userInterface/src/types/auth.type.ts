export interface Register {
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  storeId?: string;
}
export interface RegisterManager {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
}
export interface Login {
  email: string;
  password: string;
  storeId?: string;
}
export interface JoinStore {
  email: string;
  password: string;
  storeId: string;
}
export interface ChangePassword {
  email: string;
  oldPassword: string;
  newPassword: string;
}
