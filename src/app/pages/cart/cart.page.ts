/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState, appReducers } from '../../core/state/app.reducer';

import {
  Observable,
  Subscription,
  catchError,
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
import { AlertController } from '@ionic/angular';
import { ICheckoutRequest, ItemRequest } from './models/checkout';
import { CartService } from './services/cart.service';
import { ModalInfoService } from '../../core/services/modal.service';
import { AuthService } from '../../auth/services';

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

  constructor(
    private store: Store<AppState>,
    private alertController: AlertController,
    private cartService: CartService,
    private modalInfoService: ModalInfoService,
    private authService: AuthService
  ) {
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
    const title = '¿Esta seguro de vaciar el carrito?';
    this.presentAlert(
      title,
      () => this.store.dispatch(CleanCart()),
      'Vaciar carrito'
    );
  }

  checkout() {
    const title = '¿Esta seguro de guardar la compra?';
    this.presentAlert(
      title,
      () => {
        this.finishCheckout();
      },
      'Guardar'
    ); //
  }

  finishCheckout() {
    this.store
      .select('cart')
      .pipe(
        map((item) => {
          return Object.values(item?.Cart || {});
        })
      )
      .pipe(take(1))
      .subscribe((value) => {
        const items = value.map((cartItem) => {
          return {
            productId: cartItem.article.id,
            quantity: cartItem.quantity,
          };
        });
        const dataCheckout: ICheckoutRequest = {
          userId: this.authService._auth.id,
          items,
        };

        this.cartService
          .checkoutProducts(dataCheckout)
          .pipe(take(1))
          .subscribe((checkOutRes) => {
            this.modalInfoService.success(
              checkOutRes?.message || 'Orden guardada correctamnete!',
              ''
            );
            this.store.dispatch(CleanCart());
          });
        return value;
      });
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

  async presentAlert(
    title = '¿Desea continuar?',
    next = () => {},
    continueText = 'Continuar'
  ) {
    const alert = await this.alertController.create({
      header: title,
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {},
        },

        {
          text: continueText,
          handler: next,
        },
      ],
    });

    await alert.present();
  }
}
