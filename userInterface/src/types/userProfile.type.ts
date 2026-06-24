export type UserProfileValues = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  plan: number;
  createdAt: string;
  updatedAt: string;
  emailConfirmed: boolean;
};
export type AccountUpdateFormValues = {
  email: string;
  password: string;
  confirm: string;
};
export type UserProfileUpdateValues = {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
};
export type UserProfileResponse = {
  code: number;
  success: boolean;
  message: string;
  data: UserProfileValues;
};
