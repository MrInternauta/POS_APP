import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable } from 'rxjs';
import { map, mergeMap, catchError, take, tap } from 'rxjs/operators';
import { CartService } from '../services/cart.service';
import {
  AddProductCartType,
  CheckOutType,
  CheckedOutType,
  CleanCart,
  CleanCartType,
  RemoveProductCartType,
  setTotalType,
} from './cart.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/state/app.reducer';
import { selectTotal } from './cart.selector';
import { ICheckoutRequest } from '../models/checkout';

@Injectable()
export class CartEffects {
  loadtotalByAdd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AddProductCartType,
        RemoveProductCartType,
        CleanCartType,
        CheckedOutType
      ),
      mergeMap(() =>
        this.store.select(selectTotal).pipe(
          map((response) => ({
            type: setTotalType,
            response: response,
          })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private cartService: CartService,
    private store: Store<AppState>
  ) {}
}
