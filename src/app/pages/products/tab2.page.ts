/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { AlertController, InfiniteScrollCustomEvent, ModalController, ToastController } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
// eslint-disable-next-line
import { debounceTime, distinctUntilChanged, map, Observable, Subject, Subscription, take } from 'rxjs';

import { ModalInfoService } from '../../core/services/modal.service';
import { AppState } from '../../core/state/app.reducer';
import { AddProductCart } from '../cart/state/cart.actions';
import { DetailComponent } from './detail/detail.component';
import { ArticleCreate, ArticleItemResponse, CategoryItemResponse } from './models';
import { ProductsFilterDto } from './models/productFilter.dto';
import { WorkoutService } from './services/workout.service';
import { loadedExercise, loadedMoreExercise } from './state/workout.actions';

/** Products requested on every page, the API caps the limit at 50 */
export const PAGE_SIZE = 20;
/** Shorter terms keep showing the whole list instead of searching */
export const MIN_SEARCH_LENGTH = 3;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnDestroy, OnInit {
  @ViewChild('search') search: any;
  $susctiption!: Subscription;
  $susctiptionSearch!: Subscription;
  $susctiptionParams!: Subscription;
  productSuscription$!: Subscription;
  public $observable!: Observable<any>;
  public searchValue!: string | null;
  message = 'This modal example uses the modalController to present and dismiss modals.';
  public selectedFilteritem!: string;
  public historyWorkout!: Array<any>;
  public filter!: ProductsFilterDto;
  subscriptionCategories$!: Subscription;
  public categories!: Array<CategoryItemResponse>;
  /** False once every product matching the current filter is already loaded */
  public hasMoreProducts = true;
  public loading = false;
  private searchTerm$ = new Subject<string>();
  constructor(
    private toastController: ToastController,
    private store: Store<AppState>,
    private barcodeScanner: BarcodeScanner,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private exercisesService: WorkoutService,
    private modalInfoService: ModalInfoService,
    private modalCtrl: ModalController,
    private productService: WorkoutService,
    private transloco: TranslocoService
  ) {
    this.$observable = this.store.select('exercises');
  }

  ngOnInit(): void {
    this.setDefaultFilter();
    this.listenSearch();
    this.getCategories();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.$susctiption?.unsubscribe();
    this.$susctiptionSearch?.unsubscribe();
    this.$susctiptionParams?.unsubscribe();
    this.productSuscription$?.unsubscribe();
    this.subscriptionCategories$?.unsubscribe();
  }

  /** Keeps the list from being re-rendered when only its order or its page changed */
  trackByProduct(_index: number, product: ArticleItemResponse) {
    return product?.id ?? product?.code;
  }

  setDefaultFilter() {
    this.selectedFilteritem = '';
    this.filter = {
      limit: PAGE_SIZE,
      offset: 0,
      categoryId: '',
      orderBy: 'name',
      order: 'ASC',
      //The text typed in the searchbar survives a filter change
      search: this.filter?.search,
    };
  }

  listenSearch() {
    this.$susctiptionSearch = this.searchTerm$
      .pipe(
        debounceTime(350),
        map(term => (term.length >= MIN_SEARCH_LENGTH ? term : '')),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this.filter = { ...this.filter, search: term || undefined, offset: 0 };
        this.loadProducts();
      });
  }

  loadProducts(append = false, onDone?: (loaded: boolean) => void) {
    this.loading = true;
    this.productSuscription$?.unsubscribe();
    this.productSuscription$ = this.exercisesService.getProducts(this.filter).subscribe(
      response => {
        this.loading = false;
        onDone?.(!!response);
        if (!response) return;
        const received = response.products?.length || 0;
        const loaded = (append ? this.filter.offset : 0) + received;
        this.hasMoreProducts = response.total != null ? loaded < response.total : received >= this.filter.limit;
        this.store.dispatch(
          append ? loadedMoreExercise({ Exercise: response }) : loadedExercise({ Exercise: response })
        );
      },
      async error => {
        this.loading = false;
        onDone?.(false);
        const toast = await this.toastController.create({
          cssClass: 'my-custom-toast',
          header: this.transloco.translate('common.somethingWrong'),
          message: error,
          duration: 3000,
          position: 'top',
          icon: 'checkmark-circle-outline',
          color: 'primary',
          buttons: [
            {
              icon: 'close',
              htmlAttributes: {
                'aria-label': 'close',
              },
            },
          ],
        });
        toast.present();
      }
    );
  }

  /** Asks for the next page when the list is scrolled to the bottom */
  loadNextPage(event: InfiniteScrollCustomEvent) {
    if (!this.hasMoreProducts || this.loading) {
      event.target.complete();
      return;
    }
    const previousOffset = this.filter.offset;
    this.filter = { ...this.filter, offset: previousOffset + this.filter.limit };
    this.loadProducts(true, loaded => {
      //A page that failed is asked again on the next scroll instead of being skipped
      if (!loaded) this.filter = { ...this.filter, offset: previousOffset };
      event.target.complete();
    });
  }

  async scanCode() {
    try {
      const barcodeData = await this.barcodeScanner.scan();
      console.log('Barcode data', barcodeData);
      if (!barcodeData.text) {
        console.log('Invalid code');
      }
      this.searchbyCode(barcodeData.text || '');
    } catch (error) {
      if (error == 'cordova_not_available') {
        const alert = await this.alertController.create({
          header: this.transloco.translate('products.scannerUnavailable'),
          message: this.transloco.translate('products.searchManually'),
          buttons: [
            {
              text: this.transloco.translate('common.search'),
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                this.focusButton();
              },
            },
            {
              text: this.transloco.translate('common.cancel'),
              handler: () => {},
            },
          ],
        });
        alert.present();

        return;
      }
      console.log('Error', error);
    }
  }

  searchFunction($termSearch: any) {
    this.searchValue = $termSearch || null;
    this.searchTerm$.next(String($termSearch || '').trim());
  }

  searchbyCode(code: string) {
    if (!code || code?.length < MIN_SEARCH_LENGTH) {
      this.searchValue = null;
      return;
    }

    //The code is looked up on the API, the scanned product may not be on the loaded pages
    this.$susctiption?.unsubscribe();
    this.$susctiption = this.exercisesService
      .getProducts({ limit: PAGE_SIZE, offset: 0, search: code })
      .pipe(
        take(1),
        map(response =>
          (response?.products || []).filter(
            (item: ArticleItemResponse) => String(item.code).toLocaleLowerCase() === String(code).toLocaleLowerCase()
          )
        )
      )
      .subscribe(async (products: Array<ArticleItemResponse> | null) => {
        if (!products?.length || !products[0]) {
          const alert = await this.alertController.create({
            header: this.transloco.translate('products.notFound'),
            message: this.transloco.translate('products.registerQuestion'),
            buttons: [
              {
                text: this.transloco.translate('common.cancel'),
                role: 'cancel',
                cssClass: 'secondary',
              },
              {
                text: this.transloco.translate('products.register'),
                handler: () => {
                  this.openModal({
                    id: '',
                    code: code,
                    name: '',
                    description: '',
                    price: '',
                    priceSell: '',
                    stock: '',
                  });
                },
              },
            ],
          });
          alert.present();
          return;
        }
        const alert = await this.alertController.create({
          header: this.transloco.translate('products.found'),
          message: this.transloco.translate('products.addQuestion'),
          buttons: [
            {
              text: this.transloco.translate('common.edit'),
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                this.edit(products[0]);
              },
            },
            {
              text: this.transloco.translate('products.addToCart'),
              handler: () => {
                this.addToCard(products[0], 1);
              },
            },
          ],
        });
        alert.present();
      });
  }

  async addToCard(article: ArticleItemResponse, quantity: number) {
    if (!article?.stock || parseInt(article?.stock || '0') < quantity) {
      const toast = await this.toastController.create({
        cssClass: 'my-custom-toast',
        header: this.transloco.translate('products.notEnough'),
        message: article.name,
        duration: 3000,
        position: 'top',
        icon: 'checkmark-circle-outline',
        color: 'warning',
        buttons: [
          {
            icon: 'close',
            htmlAttributes: {
              'aria-label': 'close',
            },
          },
        ],
      });
      toast.present();

      return;
    }
    this.store.dispatch(AddProductCart({ article, quantity }));
    this.presentProductAddedModal(article);
    //this.router.navigate(['tabs', 'tab4'], { replaceUrl: true });
  }

  hideSearch() {
    this.searchValue = null;
    this.searchTerm$.next('');
  }

  async presentProductAddedModal(article: ArticleItemResponse) {
    const toast = await this.toastController.create({
      cssClass: 'my-custom-toast',
      header: this.transloco.translate('products.added'),
      message: article.name,
      duration: 3000,
      position: 'top',
      icon: 'checkmark-circle-outline',
      color: 'success',
      buttons: [
        {
          icon: 'close',
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
      ],
    });
    toast.present();
  }

  edit(product: ArticleCreate) {
    this.openModal(product);
  }

  async openModal(product?: ArticleCreate) {
    const modal = await this.modalCtrl.create({
      component: DetailComponent,
      componentProps: { product },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role == 'created') {
      //set data
      console.log(data);
      this.reloadFirstPage();
    }

    if (role == 'updated') {
      //update data
      console.log(data);
      this.reloadFirstPage();
    }
  }

  focusButton(): void {
    setTimeout(() => {
      this.search.setFocus();
    }, 500);
  }

  clickedItem(value: string) {
    this.selectedFilteritem = value;
    switch (value) {
      case 'more':
        this.applyOrder('stock', 'DESC');
        break;
      case 'less':
        this.applyOrder('stock', 'ASC');
        break;
      case 'az':
        this.applyOrder('name', 'ASC');
        break;
      case 'za':
        this.applyOrder('name', 'DESC');
        break;
      default:
        this.setDefaultFilter();
        this.loadProducts();
        break;
    }
  }

  clickedCategory(value: string) {
    this.filter = { ...this.filter, categoryId: value, offset: 0 };
    this.reloadFirstPage();
  }

  getCategories() {
    this.subscriptionCategories$ = this.productService.getCategories().subscribe(categoriesResponse => {
      this.categories = categoriesResponse?.categories || [];
    });
  }

  private applyOrder(orderBy: ProductsFilterDto['orderBy'], order: ProductsFilterDto['order']) {
    this.filter = { ...this.filter, orderBy, order, offset: 0 };
    this.reloadFirstPage();
  }

  private reloadFirstPage() {
    this.filter = { ...this.filter, offset: 0 };
    this.hasMoreProducts = true;
    this.loadProducts();
  }
}
