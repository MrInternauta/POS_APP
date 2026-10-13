/** Who a sale was made to; for reference, a customer does not log in */
export interface Customer {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  /** "Público en general": what a sale gets when nobody is picked. It cannot be deleted */
  isDefault: boolean;
}

export interface CustomerChanges {
  name?: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
}
