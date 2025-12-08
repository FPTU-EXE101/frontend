export type UserProfileValues = {
  customerId: string
  userId: string;
  email: string;
  fullName: string;
  userStatus: string;
  dob: string;
  gender: string;
  address: string;
  phoneNumber: string;
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