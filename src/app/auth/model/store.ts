export type StoreRole = 'OWNER' | 'CASHIER';

/** A store as the API lists it for the user, with their role in it (null for a super admin visiting) */
export interface StoreSummary {
  id: number;
  name: string;
  slug: string;
  role: StoreRole | null;
}

export interface CreateStoreDto {
  name: string;
  phone?: string;
  address?: string;
}
