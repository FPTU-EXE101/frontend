import type { ItemType } from "./enum.type";

export interface Items {
  id: string;
  storeId?: string | null;
  name: string | null;
  description?: string;
  price: number;
  duration?: number;
  status?: string;
  imageUrl?: string;
  type: ItemType; //service = 0, product = 1
}
export interface CreateItemRequest {
  storeId?: string | null;
  name?: string | null;
  price: number;
  type: ItemType;
}

export interface UpdateItemRequest {
  name?: string | null;
  price: number;
  type: ItemType;
}
