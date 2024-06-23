import { Action, createReducer, on } from '@ngrx/store';
import {
  AddProductCart,
  CheckedOut,
  CheckedOutType,
  CleanCart,
  RemoveProductCart,
  UpdateProductCart,
  setTotal,
  setTotalType,
} from './cart.actions';
import { ArticleItemResponse } from '../../products/models/index';
import { map, catchError, EMPTY } from 'rxjs';
import { ICheckoutRequest } from '../models/checkout';

export interface CartInfo {
  article: ArticleItemResponse;
  quantity: number;
}

export const CartFeatureKey = 'Cart';
export interface CartState {
  [CartFeatureKey]: Record<string, CartInfo> | null;
  total?: number | null;
}

export const CartInitialState: CartState = {
  [CartFeatureKey]: null,
  total: null,
};

const _CartReducer = createReducer(
  CartInitialState,
  on(AddProductCart, (state, { article, quantity }) => {
    if (!article || !article.code) {
      return {
        ...state,
      };
    }

    if (!state.Cart) {
      return {
        ...state,
        Cart: {
          [article.code]: { article, quantity },
        },
      };
    }

    console.log('Already exists', state.Cart[article.code]);

    if (!state.Cart[article.code]) {
      return {
        ...state,
        Cart: {
          ...state.Cart,
          [article.code]: { article, quantity },
        },
      };
    }

    const newQuantity =
      Number(state.Cart[article.code]?.quantity) + Number(quantity || 1);

    if (newQuantity <= 0) {
      let newStateCart = {
        ...state.Cart,
        [article.code]: { article, quantity: newQuantity },
      };

      delete newStateCart[article.code];

      return {
        ...state,
        Cart: newStateCart,
      };
    }

    return {
      ...state,
      Cart: {
        ...state.Cart,
        [article.code]: { article, quantity: newQuantity },
      },
    };
  }),
  on(UpdateProductCart, (state, { article, quantity }) => {
    if (!article || !article.code) {
      return {
        ...state,
      };
    }

    if (!state.Cart) {
      return {
        ...state,
        Cart: {
          [article.code]: { article, quantity },
        },
      };
    }

    if (!state.Cart[article.code]) {
      return {
        ...state,
        Cart: {
          ...state.Cart,
          [article.code]: { article, quantity },
        },
      };
    }

    const newQuantity = Number(quantity || 1);

    console.log('Already exists');

    if (newQuantity <= 0) {
      let newStateCart = {
        ...state.Cart,
        [article.code]: { article, quantity: newQuantity },
      };

      delete newStateCart[article.code];

      return {
        ...state,
        Cart: newStateCart,
      };
    }

    return {
      ...state,
      Cart: {
        ...state.Cart,
        [article.code]: { article, quantity: newQuantity },
      },
    };
  }),
  on(CleanCart, (state) => ({ ...state, Cart: null })),

  on(CheckedOut, (state) => {
    return { ...state, Cart: null };
  }),
  on(RemoveProductCart, (state, { code }) => {
    if (!state?.Cart || !state?.Cart[code]) {
      {
        return { ...state };
      }
    }
    const newCart = { ...state.Cart };
    console.log(newCart);

    delete newCart[code];
    return {
      ...state,
      Cart: newCart,
    };
  }),

  on(setTotal, (state, { total }) => {
    return { ...state, total };
  })
);

export function CartReducer(state: any, action: Action) {
  return _CartReducer(state, action);
}
