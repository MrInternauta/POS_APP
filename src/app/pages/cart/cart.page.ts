/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState, appReducers } from '../../core/state/app.reducer';

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
import {
  AddProductCart,
  CheckOut,
  CleanCart,
  RemoveProductCart,
  UpdateProductCart,
} from './state/cart.actions';
import { ArticleItemResponse } from '../products/models';
import { selectListCart, selectTotal } from './state/cart.selector';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.page.html',
  styleUrls: ['cart.page.scss'],
})
export class Tab2Page implements OnDestroy, OnInit {
  $susctiption!: Subscription;
  public $observable!: Observable<any>;
  public $total!: Observable<number>;

  message =
    'This modal example uses the modalController to present and dismiss modals.';
  public historyWorkout!: Array<any>;

  constructor(private store: Store<AppState>) {
    this.$observable = this.store.select('cart').pipe(
      map((item) => {
        return Object.values(item?.Cart || {});
      })
    );
    this.$total = this.store.select(selectTotal).pipe(tap(console.log));
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.$susctiption?.unsubscribe();
  }

  clean() {
    this.store.dispatch(CleanCart());
  }

  checkout() {
    //
    //this.store.dispatch(CheckOut());
  }

  update(article: ArticleItemResponse, quantity: number) {
    this.store.dispatch(UpdateProductCart({ article, quantity }));
  }

  removeProduct(code: string) {
    this.store.dispatch(RemoveProductCart({ code }));
  }

  valueChange(quantity: number, article: ArticleItemResponse) {
    if (quantity > 100 || quantity <= 0) {
      return;
    }
    this.update(article, quantity);
  }
}
