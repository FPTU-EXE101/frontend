export const generateUsername = (email: string): string => {
  return email.split("@")[0];
};
