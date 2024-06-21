export interface ArticleResponse {
  products: ArticleItemResponse[];
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
}

export interface ArticleCreate {
  id?: string | number;
  code: string;
  name?: string;
  stock: string;
  description: string;
  price: string;
  priceSell: string;
  categoryId?: string | number;
}

export interface CategoryResponse {
  categories: CategoryItemResponse[];
}

export interface CategoryItemResponse {
  id: number;
  name: string;
  image: string;
}
