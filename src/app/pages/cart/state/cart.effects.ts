import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError, take } from 'rxjs/operators';
import { CartService } from '../services/cart.service';
import { CheckOutType, CheckedOutType } from './cart.actions';

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

  constructor(private actions$: Actions, private cartService: CartService) {}
}
