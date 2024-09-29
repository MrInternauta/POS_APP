/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
// eslint-disable-next-line
import { map, Observable, Subscription, take } from 'rxjs';

import { ModalInfoService } from '../../core/services/modal.service';
import { AppState } from '../../core/state/app.reducer';
import { AddProductCart } from '../cart/state/cart.actions';
import { DetailComponent } from './detail/detail.component';
import { ArticleCreate, ArticleItemResponse, CategoryItemResponse } from './models';
import { ProductsFilterDto } from './models/productFilter.dto';
import { WorkoutService } from './services/workout.service';
import { loadedExercise } from './state/workout.actions';

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
  message = 'This modal example uses the modalController to present and dismiss modals.';
  public selectedFilteritem!: string;
  public historyWorkout!: Array<any>;
  public filter!: ProductsFilterDto;
  subscriptionCategories$!: Subscription;
  public categories!: Array<CategoryItemResponse>;
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
    private productService: WorkoutService
  ) {
    this.loadProducts();
    this.$observable = this.store.select('exercises');
    this.$observable.subscribe(value => {
      console.log(value?.Exercise);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {
    this.setDefaultFilter();
    this.getCategories();
  }

  ngOnDestroy(): void {
    this.$susctiption?.unsubscribe();
    this.$susctiptionSearch?.unsubscribe();
    this.$susctiptionParams?.unsubscribe();
    this.productSuscription$?.unsubscribe();
  }

  setDefaultFilter() {
    this.selectedFilteritem = '';
    this.filter = {
      limit: 1000,
      maxPrice: 9999,
      minPrice: 0,
      offset: 0,
      categoryId: '',
    };
  }

  loadProducts() {
    this.productSuscription$ = this.exercisesService.getProducts(this.filter).subscribe(
      response => {
        if (response) this.store.dispatch(loadedExercise({ Exercise: response }));
      },
      async error => {
        const toast = await this.toastController.create({
          cssClass: 'my-custom-toast',
          header: 'Algo salio mal: ',
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
          header: 'Scanner no disponible',
          message: '¿Quieres buscarlo manualmente?',
          buttons: [
            {
              text: 'Buscar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                this.focusButton();
              },
            },
            {
              text: 'Cancelar',
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
    const value = $termSearch;
    if (!value || value?.length < 3) {
      this.tempProduc$ = null;
      return;
    }
    this.tempProduc$ = this.$observable.pipe(
      map(item_ =>
        item_?.Exercise?.products.filter(
          (item: ArticleItemResponse) =>
            String(item.name).toLocaleLowerCase().includes(String(value).toLocaleLowerCase()) ||
            String(item.description).toLocaleLowerCase().includes(String(value).toLocaleLowerCase()) ||
            String(item?.code).toLocaleLowerCase().includes(String(value).toLocaleLowerCase())
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
        map(item_ =>
          item_?.Exercise?.products.filter((item: any) =>
            String(item.code).toLocaleLowerCase().includes(String(code).toLocaleLowerCase())
          )
        )
      )
      .subscribe(async (products: Array<ArticleItemResponse> | null) => {
        if (!products?.length || !products[0]) {
          const alert = await this.alertController.create({
            header: 'Producto no encontrado',
            message: '¿Quieres registrarlo?',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'secondary',
              },
              {
                text: 'Registrar',
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
          header: 'Producto encontrado',
          message: '¿Quieres agregar al carrito?',
          buttons: [
            {
              text: 'Editar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                this.edit(products[0]);
              },
            },
            {
              text: 'Agregar al Carrito',
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
        header: 'Producto no cuenta con suficientes existencias: ',
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
    this.tempProduc$ = null;
  }

  async presentProductAddedModal(article: ArticleItemResponse) {
    const toast = await this.toastController.create({
      cssClass: 'my-custom-toast',
      header: 'Producto agregado al carrito: ',
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

  clickedItem(value: string) {
    this.selectedFilteritem = value;
    switch (value) {
      case 'more':
        //this.showClearButton = true;
        break;
      case 'less':
        //this.showClearButton = true;
        break;
      default:
        this.setDefaultFilter();
        this.loadProducts();
        break;
    }
  }

  clickedCategory(value: string) {
    this.setDefaultFilter();
    this.filter.categoryId = value;
    this.loadProducts();
    //this.showClearButton = true;
  }

  getCategories() {
    this.subscriptionCategories$ = this.productService.getCategories().subscribe(categoriesResponse => {
      this.categories = categoriesResponse?.categories || [];
      console.log(this.categories);
    });
  }
}
