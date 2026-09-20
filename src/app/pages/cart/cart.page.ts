/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { Observable, Subscription, map, take } from 'rxjs';

import { AuthService } from '../../auth/services';
import { ModalInfoService } from '../../core/services/modal.service';
import { AppState } from '../../core/state/app.reducer';
import { ArticleItemResponse } from '../products/models';
import { WorkoutService } from '../products/services/workout.service';
import { ICheckoutRequest } from './models/checkout';
import { CartService } from './services/cart.service';
import { CleanCart, RefreshCartStock, RemoveProductCart, UpdateProductCart } from './state/cart.actions';
import { selectTotal } from './state/cart.selector';
import { CartInfo } from './state/cart.state';

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

  private stockSubscription$!: Subscription;

  constructor(
    private store: Store<AppState>,
    private alertController: AlertController,
    private cartService: CartService,
    private modalInfoService: ModalInfoService,
    private authService: AuthService,
    private productService: WorkoutService,
    private transloco: TranslocoService
  ) {
    this.$observable = this.store.select('cart').pipe(
      map(item => {
        return Object.values(item?.Cart || {});
      })
    );
    this.$total = this.store.select(selectTotal);
  }

  ngOnInit(): void {
    this.refreshStock();
  }

  /**
   * The cart keeps a copy of each product, and it survives a restart, so its stock is as old as
   * the moment the product was added. Ionic keeps the page alive between visits, which is why
   * this runs on every entry and not only in ngOnInit.
   */
  ionViewWillEnter(): void {
    this.refreshStock();
  }

  refreshStock(): void {
    this.stockSubscription$?.unsubscribe();
    this.stockSubscription$ = this.cartItems$()
      .pipe(take(1))
      .subscribe(items => {
        const codes = items.map(item => item?.article?.code).filter(Boolean);

        if (!codes.length) {
          return;
        }

        this.productService
          .getProductsByCodes(codes)
          .pipe(take(1))
          .subscribe(response => {
            this.store.dispatch(RefreshCartStock({ articles: response?.products || [] }));
          });
      });
  }

  /** Stock left once what is already in the cart is taken out */
  availableStock(item: CartInfo): number {
    return this.stockOf(item) - Number(item?.quantity || 0);
  }

  cartHasStockIssues(items: CartInfo[] | null): boolean {
    return (items || []).some(item => !this.hasEnoughStock(item));
  }

  hasEnoughStock(item: CartInfo): boolean {
    return this.availableStock(item) >= 0 && this.stockOf(item) > 0;
  }

  private stockOf(item: CartInfo): number {
    return Number(item?.article?.stock ?? 0) || 0;
  }

  private cartItems$(): Observable<CartInfo[]> {
    return this.store.select('cart').pipe(map(item => Object.values(item?.Cart || {}) as CartInfo[]));
  }

  /** Keeps a card from being re-rendered when only the quantity of another one changed */
  trackByCartItem(_index: number, item: { article?: ArticleItemResponse }) {
    return item?.article?.id ?? item?.article?.code;
  }

  ngOnDestroy(): void {
    this.$susctiption?.unsubscribe();
    this.stockSubscription$?.unsubscribe();
  }

  clean() {
    const title = this.transloco.translate('cart.cleanQuestion');
    this.presentAlert(title, () => this.store.dispatch(CleanCart()), this.transloco.translate('cart.clean'));
  }

  checkout() {
    const title = this.transloco.translate('cart.checkoutQuestion');
    this.presentAlert(
      title,
      () => {
        this.finishCheckout();
      },
      this.transloco.translate('common.save')
    ); //
  }

  finishCheckout() {
    this.cartItems$()
      .pipe(take(1))
      .subscribe(value => {
        //The API would refuse the order anyway, this says which product is the problem
        const withoutStock = value.filter(cartItem => !this.hasEnoughStock(cartItem));

        if (withoutStock.length) {
          this.modalInfoService.warning(
            this.transloco.translate('common.notEnoughStock'),
            withoutStock.map(cartItem => cartItem?.article?.name).join(', ')
          );
          return;
        }

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
            this.modalInfoService.success(this.transloco.translate('cart.saved'), '');
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
      this.modalInfoService.warning(this.transloco.translate('cart.invalidQuantity'), article?.name || '');
      return;
    }

    if (Number(article?.stock ?? 0) < quantity) {
      this.modalInfoService.warning(this.transloco.translate('products.notEnough'), article?.name || '');
      return;
    }

    this.update(article, quantity);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async presentAlert(title = '', next = () => {}, continueText = '') {
    const alert = await this.alertController.create({
      header: title || this.transloco.translate('common.confirm'),
      buttons: [
        {
          text: this.transloco.translate('common.cancel'),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          handler: () => {},
        },

        {
          text: continueText || this.transloco.translate('common.continue'),
          handler: next,
        },
      ],
    });

    await alert.present();
  }
}
