export interface ProductsFilterDto {
  minPrice: number;

  maxPrice: number;

  limit: number;

  offset: number;

  categoryId?: string;

  orderBy?: string;
}
