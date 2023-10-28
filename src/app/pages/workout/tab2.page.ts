/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AlertButton,
  AlertController,
  AlertInput,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/state/app.reducer';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { EMPTY } from 'rxjs';

import { loadExercise, loadedExercise, loadedExerciseType } from './state/workout.actions';
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
import { Article } from './models';
import { AddProductCart, setTotal } from '../cart/state/cart.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from './services/workout.service';
import { ProductsFilterDto } from './models/productFilter.dto';
import { ModalInfoService } from '../../core/services/modal.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnDestroy, OnInit {
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
    private modalInfoService: ModalInfoService

  ) {

    this.$susctiptionParams = this.activatedRoute.queryParams.subscribe(params => {
      const productFilter: ProductsFilterDto = {
        limit: params?.['limit'] || 10,
        maxPrice: params?.['maxPrice'] || 9999,
        minPrice: params?.['minPrice'] || 1,
        offset: params?.['offset'] || 0
       }
      this.productSuscription$ = this.exercisesService.getProducts(productFilter).subscribe((response) => {
        if(response)
          this.store.dispatch(loadedExercise({ Exercise: response }));
      },
      error=>{
        this.modalInfoService.error('Something is wrong!', error)
      }
      )
  });

    this.$observable = this.store.select('exercises');
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.$susctiption?.unsubscribe();
    this.$susctiptionSearch?.unsubscribe();
    this.$susctiptionParams?.unsubscribe();
    this.productSuscription$?.unsubscribe();
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
        item_?.Exercise?.aaData.filter(
          (item: any) =>
            String(item.nombre)
              .toLocaleLowerCase()
              .includes(String(value).toLocaleLowerCase()) ||
            String(item.descripcion)
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
        map((item_) =>
          item_?.Exercise?.aaData.filter((item: any) =>
            String(item.codigo)
              .toLocaleLowerCase()
              .includes(String(code).toLocaleLowerCase())
          )
        )
      )
      .subscribe((products: Array<Article> | null) => {
        if (!products?.length || !products[0]) {
          return;
        }
        this.addToCard(products[0], 1);
      });
  }

  addToCard(article: Article, quantity: number) {
    this.store.dispatch(AddProductCart({ article, quantity }));
    this.presentToast();
    this.router.navigate(['tabs', 'tab4'], { replaceUrl: true });
  }

  hideSearch() {
    this.searchValue = null;
    this.tempProduc$ = null;
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Product added',
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }

  addPrice(product: Article) {
    this.presentAlert(product);
  }

  async presentAlert(product: Article) {
    const ok_buttons: AlertButton = {
      text: 'OK',
      handler: (val) => {
        //TODO: Create input_products
        console.log(product);
        console.log(val);
      },
    };
    const cancel_buttons: AlertButton = {
      text: 'Cancel',
    };

    const alert = await this.alertController.create({
      header: 'Please enter the product info',
      buttons: [cancel_buttons, ok_buttons],
      inputs: [
        {
          type: 'number',
          label: 'Stock',
          placeholder: 'Stock',
          min: 1,
          max: 1000,
          value: Number(product.stock) || 0,
        },
        {
          type: 'number',
          label: 'Buying price',
          placeholder: 'Buying price',
          min: 1,
          max: 1000,
          value: Number(product.priceSell) || 0,
        },
        {
          type: 'number',
          label: 'Selling price',
          placeholder: 'Selling price',
          min: 1,
          max: 1000,

          value: Number(product.priceSell) || 0,
        },
      ],
    });

    await alert.present();
  }
}
