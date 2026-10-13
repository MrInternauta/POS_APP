import { Id } from '../../../core/models/index';
export interface ICheckoutRequest {
  userId: Id;
  /** Who the sale is made to; left out, the store's default customer */
  customerId?: number;
  items: ItemRequest[];
}

export interface ItemRequest {
  productId: number | string;
  quantity: number | string;
}
