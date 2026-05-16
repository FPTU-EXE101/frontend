export type UserProfileValues = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  plan: number;
  createAt: string;
  updateAt: string;
  emailConfirmed: boolean;
};
export type AccountUpdateFormValues = {
  email: string;
  password: string;
  confirm: string;
};
export type UserProfileUpdateValues = {
  fullName: string;
  dob: string;
  gender: string;
  address: string;
  phoneNumber: string;
};
export type UserProfileResponse = {
  code: number;
  success: boolean;
  message: string;
  data: UserProfileValues;
};
