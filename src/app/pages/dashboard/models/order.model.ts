import { ArticleItemResponse } from '../../products/models/index';

export interface IOrderModel {
  orders: OrderResponse[];
}

export interface OrderResponse {
  createAt: string;
  updateAt: null;
  deletedAt: null;
  id: number;
  items: ItemResponse[];
  total: number;
}

export interface ItemResponse {
  id: number;
  quantity: number;
  //The price it sold at; the product's own price may have changed since
  unitPrice?: number;
  product: ArticleItemResponse;
}
