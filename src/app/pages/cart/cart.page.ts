/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, Subscription, map, take, tap } from 'rxjs';

import { AuthService } from '../../auth/services';
import { ModalInfoService } from '../../core/services/modal.service';
import { AppState } from '../../core/state/app.reducer';
import { ArticleItemResponse } from '../products/models';
import { ICheckoutRequest } from './models/checkout';
import { CartService } from './services/cart.service';
import { CleanCart, RemoveProductCart, UpdateProductCart } from './state/cart.actions';
import { selectTotal } from './state/cart.selector';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.page.html',
  styleUrls: ['cart.page.scss'],
})
export class Tab2Page implements OnDestroy, OnInit {
  $susctiption!: Subscription;
  public $observable!: Observable<any>;
  public $total!: Observable<number>;

  message = 'This modal example uses the modalController to present and dismiss modals.';
  public historyWorkout!: Array<any>;

  constructor(
    private store: Store<AppState>,
    private alertController: AlertController,
    private cartService: CartService,
    private modalInfoService: ModalInfoService,
    private authService: AuthService
  ) {
    this.$observable = this.store.select('cart').pipe(
      map(item => {
        return Object.values(item?.Cart || {});
      })
    );
    this.$total = this.store.select(selectTotal).pipe(tap(console.log));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.$susctiption?.unsubscribe();
  }

  clean() {
    const title = '¿Esta seguro de vaciar el carrito?';
    this.presentAlert(title, () => this.store.dispatch(CleanCart()), 'Vaciar carrito');
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
        map(item => {
          return Object.values(item?.Cart || {});
        })
      )
      .pipe(take(1))
      .subscribe(value => {
        const items = value.map(cartItem => {
          return {
            productId: cartItem.article.id,
            quantity: cartItem.quantity,
          };
        });
        const dataCheckout: ICheckoutRequest = {
          userId: this.authService?._auth?.id || '',
          items,
        };

        this.cartService
          .checkoutProducts(dataCheckout)
          .pipe(take(1))
          .subscribe(() => {
            this.modalInfoService.success('Orden guardada correctamente!', '');
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
      this.modalInfoService.warning('El producto no cuenta con suficientes existencias', article.name);
      return;
    }

    if (!article?.stock || parseInt(article?.stock || '0') < quantity) {
      this.modalInfoService.warning('El producto no cuenta con suficientes existencias', article.name);
      return;
    }

    this.update(article, quantity);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async presentAlert(title = '¿Desea continuar?', next = () => {}, continueText = 'Continuar') {
    const alert = await this.alertController.create({
      header: title,
      buttons: [
        {
          text: 'Cancelar',
          // eslint-disable-next-line @typescript-eslint/no-empty-function
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
