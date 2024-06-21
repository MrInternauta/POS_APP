import { CreateCategoryDto } from "./category.dto";

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
  category?: CreateCategoryDto;
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
