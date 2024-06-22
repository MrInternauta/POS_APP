import { UserDto } from '../../../auth/model/user.dto';
import { ArticleItemResponse } from '../../products/models/index';
export interface CheckoutResponse {
  message: string;
  order: Order;
}

export interface Order {
  user: UserDto;
  items: Item[];
  id: number;
  total: number;
}

export interface Item {
  quantity: number;
  product: ArticleItemResponse;
  id: number;
}
