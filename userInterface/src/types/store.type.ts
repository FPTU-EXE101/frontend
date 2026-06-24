export interface CustomerStore {
  id: string;
  name: string;
}

export interface Store {
  id: string;
  managerId: string;
  name: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
}

export interface UpdateStore {
  managerId: string;
  name: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
}
