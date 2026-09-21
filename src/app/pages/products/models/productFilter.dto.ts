export type ProductOrderBy = 'name' | 'code' | 'price' | 'priceSell' | 'stock';

export type OrderDirection = 'ASC' | 'DESC';

export interface ProductsFilterDto {
  minPrice?: number;

  maxPrice?: number;

  limit: number;

  offset: number;

  categoryId?: string;

  /** Ask for an exact set of products, used to refresh what the cart holds */
  codes?: string[];

  /** Free text matched against name, description and code */
  search?: string;

  orderBy?: ProductOrderBy;

  order?: OrderDirection;
}
