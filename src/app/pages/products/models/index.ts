export interface ArticleResponse {
  products: ArticleItemResponse[];
  /** Amount of products matching the filter, ignoring limit/offset */
  total?: number;
  limit?: number;
  offset?: number;
}

export interface ArticleItemResponse {
  id: string;
  categoryId: string;
  code: string;
  name: string;
  stock: string;
  description: string;
  image: string;
  price: string;
  priceSell: string;
  category?: CategoryItemResponse;
  /** The list is public, so it only brings the id. The provider itself is read by an admin */
  providerId?: number | null;
  /** Shown in the store's public catalogue */
  isPublic?: boolean;
}

export interface ArticleCreate {
  id?: string | number;
  code: string;
  name?: string;
  stock: string;
  description: string;
  price: string;
  priceSell: string;
  /** null takes the category off, leaving it out keeps the one the product has */
  categoryId?: string | number | null;
  /** null takes the provider off, leaving it out keeps the one the product has */
  providerId?: string | number | null;
  isPublic?: boolean;
}

export interface CategoryResponse {
  categories: CategoryItemResponse[];
}

export interface CategoryItemResponse {
  id: number;
  name: string;
  image: string;
}

export interface ProviderResponse {
  providers: ProviderItemResponse[];
}

export interface ProviderItemResponse {
  id: number;
  name: string;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
}

/** null clears a field on an edit */
export interface CreateProviderDto {
  name: string;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface ProductImportError {
  row: number;
  code?: string;
  message: string;
}

export interface ProductImportSummary {
  total: number;
  created: number;
  updated: number;
  failed: number;
  errors: ProductImportError[];
}
