/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AlertButton,
  AlertController,
  AlertInput,
  IonModal,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/state/app.reducer';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { EMPTY } from 'rxjs';

import {
  loadExercise,
  loadedExercise,
  loadedExerciseType,
} from './state/workout.actions';
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
import { ArticleItemResponse, ArticleCreate } from './models';
import { AddProductCart, setTotal } from '../cart/state/cart.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsFilterDto } from './models/productFilter.dto';
import { ModalInfoService } from '../../core/services/modal.service';
import { DetailComponent } from './detail/detail.component';
import { WorkoutService } from './services/workout.service';

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
  public tempProduc$!: Observable<any> | null;
  public searchValue!: string | null;
  message =
    'This modal example uses the modalController to present and dismiss modals.';

  public historyWorkout!: Array<any>;
  constructor(
    private toastController: ToastController,
    private store: Store<AppState>,
    private barcodeScanner: BarcodeScanner,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private exercisesService: WorkoutService,
    private modalInfoService: ModalInfoService,
    private modalCtrl: ModalController
  ) {
    this.loadProducts();
    this.$observable = this.store.select('exercises');
    this.$observable.subscribe((value) => {
      console.log(value?.Exercise);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.$susctiption?.unsubscribe();
    this.$susctiptionSearch?.unsubscribe();
    this.$susctiptionParams?.unsubscribe();
    this.productSuscription$?.unsubscribe();
  }

  loadProducts() {
    this.$susctiptionParams = this.activatedRoute.queryParams.subscribe(
      (params) => {
        const productFilter: ProductsFilterDto = {
          limit: params?.['limit'] || 1000,
          maxPrice: params?.['maxPrice'] || 9999,
          minPrice: params?.['minPrice'] || 0,
          offset: params?.['offset'] || 0,
        };
        this.productSuscription$ = this.exercisesService
          .getProducts(productFilter)
          .subscribe(
            (response) => {
              console.log(params);
              if (response)
                this.store.dispatch(loadedExercise({ Exercise: response }));
            },
            (error) => {
              this.modalInfoService.error('Algo salio mal!', error);
            }
          );
      }
    );
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
        this.modalInfoService.warning(
          'Scanner no disponible',
          '¿Quieres buscarlo manualmente?',
          () => {
            this.focusButton();
            console.log('focus input');
          }
        );
        return;
      }
      console.log('Error', error);
    }
  }

  searchFunction($termSearch: any) {
    const value = $termSearch?.target?.value;
    if (!value || value?.length < 3) {
      this.tempProduc$ = null;
      return;
    }
    this.tempProduc$ = this.$observable.pipe(
      map((item_) =>
        item_?.Exercise?.products.filter(
          (item: ArticleItemResponse) =>
            String(item.name)
              .toLocaleLowerCase()
              .includes(String(value).toLocaleLowerCase()) ||
            String(item.description)
              .toLocaleLowerCase()
              .includes(String(value).toLocaleLowerCase()) ||
            String(item?.code)
              .toLocaleLowerCase()
              .includes(String(value).toLocaleLowerCase())
        )
      )
    );
  }

  searchbyCode(code: string) {
    if (!code || code?.length < 3) {
      this.searchValue = null;
      this.tempProduc$ = null;
      return;
    }

    this.$susctiptionSearch = this.$observable
      .pipe(
        take(1),
        map((item_) =>
          item_?.Exercise?.products.filter((item: any) =>
            String(item.code)
              .toLocaleLowerCase()
              .includes(String(code).toLocaleLowerCase())
          )
        )
      )
      .subscribe((products: Array<ArticleItemResponse> | null) => {
        if (!products?.length || !products[0]) {
          //TODO: If is admin option to add new product

          this.modalInfoService.warning(
            'El producto no existe',
            '¿Quieres registrarlo?',
            () => {
              this.openModal({
                id: '',
                code: code,
                name: '',
                description: '',
                price: '',
                priceSell: '',
                stock: '',
              });
            }
          );
          // this.s;

          return;
        }
        this.addToCard(products[0], 1);
      });
  }

  addToCard(article: ArticleItemResponse, quantity: number) {
    this.store.dispatch(AddProductCart({ article, quantity }));
    this.presentProductAddedModal(article);
    //this.router.navigate(['tabs', 'tab4'], { replaceUrl: true });
  }

  hideSearch() {
    this.searchValue = null;
    this.tempProduc$ = null;
  }

  async presentProductAddedModal(article: ArticleItemResponse) {
    this.modalInfoService.success('Producto agregado al carrito', article.name);
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
      this.loadProducts();
    }

    if (role == 'updated') {
      //update data
      console.log(data);
      this.loadProducts();
    }
  }

  focusButton(): void {
    setTimeout(() => {
      this.search.setFocus();
    }, 500);
  }
}
