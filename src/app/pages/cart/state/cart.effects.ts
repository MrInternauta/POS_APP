import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError, take, tap } from 'rxjs/operators';
import { CartService } from '../services/cart.service';
import {
  AddProductCartType,
  CheckOutType,
  CheckedOutType,
  CleanCartType,
  RemoveProductCartType,
  setTotalType,
} from './cart.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/state/app.reducer';
import { selectTotal } from './cart.selector';

@Injectable()
export class CartEffects {
  loadExercises$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckOutType),
      mergeMap(() =>
        this.cartService.checkoutProducts({}).pipe(
          map((response) => ({
            type: CheckedOutType,
            response: response,
          })),
          catchError(() => EMPTY)
        )
      )
    )
  );

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
          tap(console.log),
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
