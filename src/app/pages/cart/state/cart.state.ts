import { Action, createReducer, on } from '@ngrx/store';
import { AddProductCart } from './cart.actions';
import { Article } from '../../workout/models/index';

interface CartInfo {
  article: Article;
  quantity: number;
}

export const CartFeatureKey = 'Cart';
export interface CartState {
  [CartFeatureKey]: Record<string, CartInfo> | null;
}

export const CartInitialState: CartState = {
  [CartFeatureKey]: null,
};

const _CartReducer = createReducer(
  CartInitialState,
  on(AddProductCart, (state, { article, quantity }) => {
    if (!article || !article.codigo) {
      return {
        ...state,
      };
    }

    if (!state.Cart) {
      return {
        ...state,
        Cart: {
          [article.codigo]: { article, quantity },
        },
      };
    }

    if (!state.Cart[article.codigo]) {
      return {
        ...state,
        Cart: {
          ...state.Cart,
          [article.codigo]: { article, quantity },
        },
      };
    }

    const newQuantity = state.Cart[article.codigo]?.quantity || 0 + quantity;
    if (newQuantity <= 0) {
      let newStateCart = {
        ...state.Cart,
        [article.codigo]: { article, quantity: newQuantity },
      };

      delete newStateCart[article.codigo];

      return {
        ...state,
        Cart: newStateCart,
      };
    }

    return {
      ...state,
      Cart: {
        ...state.Cart,
        [article.codigo]: { article, quantity: newQuantity },
      },
    };
  })
);

export function CartReducer(state: any, action: Action) {
  return _CartReducer(state, action);
}
