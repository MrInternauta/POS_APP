import { StoreRole } from '../../auth/model/store';

export interface StoreDetails {
  id: number;
  name: string;
  slug: string;
  phone?: string | null;
  address?: string | null;
  logo?: string | null;
  timezone: string;
  active: boolean;
}

export interface Member {
  id: number;
  role: StoreRole;
  since: string;
  user: { id: number; name: string; lastName: string; email: string; phone: string; image?: string };
}

export interface NewMember {
  email: string;
  role: StoreRole;
  name?: string;
  lastName?: string;
  phone?: string;
  password?: string;
}

/** A store as the super admin lists it */
export interface AdminStore extends StoreDetails {
  members: number;
  owners: string[];
}

export interface PublicCatalog {
  store: { name: string; slug: string; phone?: string | null; address?: string | null; logo?: string | null };
  products: {
    id: number;
    code: string;
    name: string;
    description: string;
    priceSell: number;
    image: string;
    inStock: boolean;
    category: string | null;
  }[];
  total: number;
}
