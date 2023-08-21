import { createAction, props } from '@ngrx/store';
import { Article } from '../../workout/models/index';

export const AddProductCartType = '[Cart] Add product to cart';
export const AddProductCart = createAction(
  AddProductCartType,
  props<{ article: Article; quantity: number }>()
);

export const RemoveProductCartType = '[Cart] Remove product from cart';
export const RemoveProductCart = createAction(RemoveProductCartType);

export const CheckOutType = "[CheckOut] Buy product's cart";
export const CheckOut = createAction(CheckOutType);

export const CleanCartType = '[CleanCart] Clean up the cart';
export const CleanCart = createAction(CleanCartType);

//Efect
export const AddedProductCartType = '[Cart] Added product to cart';
export const AddedProductCart = createAction(AddedProductCartType);
