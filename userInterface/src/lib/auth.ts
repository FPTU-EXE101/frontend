import { jwtDecode } from "jwt-decode";

export const CLAIM_USER_ID =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

export const CLAIM_NAME =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

export const CLAIM_EMAIL =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

export const CLAIM_ROLE =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

const TOKEN_KEY = "token";
const LEGACY_AUTH_KEYS = [
  "userId",
  "email",
  "role",
  "name",
  "isLoggedIn",
  "selectedStoreId",
  "selectedStoreName",
] as const;

if (typeof window !== "undefined") {
  localStorage.removeItem("selectedStoreId");
  localStorage.removeItem("selectedStoreName");
}

export type JwtPayload = {
  [CLAIM_USER_ID]: string;
  [CLAIM_NAME]: string;
  [CLAIM_EMAIL]: string;
  [CLAIM_ROLE]: string;
  exp: number;
  iss?: string;
  aud?: string;
  storeId?: string;
  StoreId?: string;
  store_id?: string;
};

export type CurrentUser = {
  userId: string;
  name: string;
  email: string;
  role: string;
  exp: number;
  storeId?: string;
};

const getStoreIdFromPayload = (payload: JwtPayload): string | undefined => {
  const directStoreId = payload.storeId ?? payload.StoreId ?? payload.store_id;
  if (directStoreId) {
    return directStoreId;
  }

  const matchingClaim = Object.entries(payload).find(([key, value]) => {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    return normalizedKey.endsWith("storeid") && typeof value === "string";
  });

  return matchingClaim?.[1] as string | undefined;
};

export const generateUsername = (email: string): string => {
  return email.split("@")[0];
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
};

const removeLegacyAuthKeys = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  LEGACY_AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  removeLegacyAuthKeys();
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  removeLegacyAuthKeys();
};

export const getDecodedToken = (): JwtPayload | null => {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (): boolean => {
  const payload = getDecodedToken();

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
};

export const getCurrentUser = (): CurrentUser | null => {
  const payload = getDecodedToken();

  if (!payload || isTokenExpired()) {
    return null;
  }

  const userId = payload[CLAIM_USER_ID];
  const name = payload[CLAIM_NAME];
  const email = payload[CLAIM_EMAIL];
  const role = payload[CLAIM_ROLE];
  const storeId = getStoreIdFromPayload(payload);

  if (!userId || !name || !email || !role) {
    return null;
  }

  return {
    userId,
    name,
    email,
    role,
    exp: payload.exp,
    ...(storeId ? { storeId } : {}),
  };
};

export const getCurrentUserId = (): string | null => {
  return getCurrentUser()?.userId ?? null;
};

export const getCurrentUserEmail = (): string | null => {
  return getCurrentUser()?.email ?? null;
};

export const getCurrentUserRole = (): string | null => {
  return getCurrentUser()?.role ?? null;
};

export const getCurrentUserName = (): string | null => {
  return getCurrentUser()?.name ?? null;
};

export const getCurrentStoreId = (): string | null => {
  return getCurrentUser()?.storeId ?? null;
};

export const getAuthenticatedStoreId = (): string | null => {
  return getCurrentUser()?.storeId ?? null;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const logout = (): void => {
  removeToken();
};
