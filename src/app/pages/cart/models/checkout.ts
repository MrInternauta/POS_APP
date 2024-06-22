import { Id } from '../../../core/models/index';
export interface ICheckoutRequest {
  userId: Id;
  items: ItemRequest[];
}

export interface ItemRequest {
  productId: number | string;
  quantity: number | string;
}
