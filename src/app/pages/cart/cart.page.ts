/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/state/app.reducer';

import {
  Observable,
  Subscription,
  filter,
  find,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.page.html',
  styleUrls: ['cart.page.scss'],
})
export class Tab2Page implements OnDestroy, OnInit {
  $susctiption!: Subscription;
  public $observable!: Observable<any>;
  message =
    'This modal example uses the modalController to present and dismiss modals.';
  public historyWorkout!: Array<any>;

  constructor(private store: Store<AppState>) {
    this.$observable = this.store.select('cart').pipe(
      map((item) => {
        return Object.values(item?.Cart || {});
      }),
      tap(console.log)
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.$susctiption?.unsubscribe();
  }

  clean() {}
  checkout() {}
  update() {}
  removeProduct() {}
}
