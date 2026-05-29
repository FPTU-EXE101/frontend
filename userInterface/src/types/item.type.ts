import type { ItemType } from "./enum.type";

export interface Items {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  status?: string;
  imageUrl?: string;
  type: ItemType; //service = 0, product = 1
}
export interface CreateItemRequest {
  name: string;
  price: number;
  type: ItemType; //service = 0, product = 1
}
