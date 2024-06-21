import { createAction, props } from '@ngrx/store';
import { ArticleItemResponse } from '../../products/models/index';

export const AddProductCartType = '[Cart] Add product to cart';
export const AddProductCart = createAction(
  AddProductCartType,
  props<{ article: ArticleItemResponse; quantity: number }>()
);

export const UpdateProductCartType = '[Cart] Update product cart';
export const UpdateProductCart = createAction(
  AddProductCartType,
  props<{ article: ArticleItemResponse; quantity: number }>()
);

export const setTotalType = '[Cart] Set total to cart';
export const setTotal = createAction(
  setTotalType,
  props<{ total: number | null }>()
);


export const RemoveProductCartType = '[Cart] Remove product from cart';
export const RemoveProductCart = createAction(
  RemoveProductCartType,
  props<{ code: string }>()
);

export const CheckOutType = "[CheckOut] Buy product's cart";
export const CheckOut = createAction(CheckOutType);

export const CheckedOutType = "[CheckOut] Buy product's cart";
export const CheckedOut = createAction(
  CheckedOutType,
  props<{ response: any }>()
);

export const CleanCartType = '[CleanCart] Clean up the cart';
export const CleanCart = createAction(CleanCartType);

