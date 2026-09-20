import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AppState } from '../../../core/state/app.reducer';
import { CartService } from '../services/cart.service';
import { AddProductCartType, CheckedOutType, CleanCartType, RemoveProductCartType, setTotal } from './cart.actions';
import { selectTotal } from './cart.selector';

@Injectable()
export class CartEffects {
  loadtotalByAdd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AddProductCartType, RemoveProductCartType, CleanCartType, CheckedOutType),
      //switchMap with take(1) reads the total once per action. mergeMap over a store selector
      //never completes, so each add left another live subscription answering forever.
      switchMap(() =>
        this.store.select(selectTotal).pipe(
          take(1),
          map(total => setTotal({ total })),
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
