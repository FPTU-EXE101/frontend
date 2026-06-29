export interface PlatformPlan {
  id: string;
  name: string | null;
  price: number;
  durationInDays: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreatePlatformPlan {
  name: string | null;
  price: number;
  durationInDays: number;
  isActive: boolean;
}

export type UpdatePlatformPlan = CreatePlatformPlan;
