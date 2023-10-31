import { CreateCategoryDto } from "./category.dto";

export interface ArticleResponse {
  products: Article[];
}

export interface Article {
  id: string;
  categoryId: string;
  code: string;
  name: string;
  stock: string;
  description: string;
  image: string;
  price: string;
  priceSell: string;
  category?: CreateCategoryDto
}
