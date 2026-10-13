import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription, map, take } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { selectUser } from '../../../auth/state/auth.state';
import { ISelectItem } from '../../../core/models/iselect.item';
import { ModalInfoService } from '../../../core/services/modal.service';
import { PictureService } from '../../../core/services/picture.service';
import { AppState } from '../../../core/state/app.reducer';
import { ArticleCreate, ArticleItemResponse } from '../models';
import { WorkoutService } from '../services/workout.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnDestroy, OnInit {
  @Input() product?: ArticleItemResponse | null = null;
  name!: string;
  code!: string;
  stock!: string;
  price!: string;
  price_sell!: string;
  description!: string;
  /** Left undefined until it is picked, so saving keeps what the product has. '' means none */
  categoryId?: string;
  providerId?: string;
  subscription$!: Subscription;
  subscriptionCategories$!: Subscription;
  categories!: Array<ISelectItem>;
  subscriptionProviders$!: Subscription;
  /** Only an admin can read the providers, so for anyone else the field is not shown */
  providers: Array<ISelectItem> = [];
  isAdmin = false;
  didSomeChange!: boolean;
  constructor(
    private productService: WorkoutService,
    private modalInfoService: ModalInfoService,
    private modalCtrl: ModalController,
    private pictureService: PictureService,
    private transloco: TranslocoService,
    private store: Store<AppState>
  ) {
    this.getCategories();
  }

  get isValidForm() {
    //Required fields
    if (!this.name) {
      return false;
    }

    if (!this.code) {
      return false;
    }

    if (!isStock(this.stock)) {
      return false;
    }

    if (!this.price && !this.price_sell) {
      return false;
    }
    //Required fields
    if (!this.didSomeChange) {
      return false;
    }

    return true;
  }

  ngOnInit(): void {
    if (this.product) {
      this.name = this.product?.name;
      this.code = this.product?.code;
      this.stock = this.product?.stock;
      this.price = this.product?.price;
      this.price_sell = this.product?.priceSell;
      this.description = this.product?.description;
      console.log(this.product);
    }

    this.store
      .select(selectUser)
      .pipe(
        take(1),
        map(user => String(user?.role?.name || '').toLowerCase() === 'admin')
      )
      .subscribe(isAdmin => {
        this.isAdmin = isAdmin;
        //Asking without being an admin answers 401, and that logs the user out
        if (isAdmin) this.getProviders();
      });
  }

  getImage() {
    if (!this.product?.id) {
      return;
    }

    this.pictureService.changePicture(this.product?.id ?? '', 'product');
  }

  getCategories() {
    this.subscriptionCategories$ = this.productService.getCategories().subscribe(categoriesResponse => {
      const categories =
        categoriesResponse?.categories.map(item => {
          return {
            name: item.name,
            value: item.id.toString(),
            selected:
              item.id?.toString()?.toLocaleLowerCase() === this.product?.category?.id?.toString()?.toLocaleLowerCase(),
          };
        }) || [];
      //The first option takes the category off
      this.categories = [{ name: this.transloco.translate('products.noCategory'), value: '' }, ...categories];
    });
  }

  getProviders() {
    this.subscriptionProviders$ = this.productService.getProviders().subscribe(response => {
      const providers = (response?.providers || []).map(item => ({
        name: item.name,
        value: item.id.toString(),
        selected: item.id === this.product?.providerId,
      }));
      this.providers = [{ name: this.transloco.translate('products.noProvider'), value: '' }, ...providers];
    });
  }

  cancel() {
    this.removeSubscription();
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.fillEmptyForm();

    if (!this.product || (this.product?.code && !this.product?.id)) {
      const product: ArticleCreate = {
        name: this.name,
        code: this.code,
        stock: this.stock,
        price: this.price,
        priceSell: this.price_sell,
        description: this.description,
        categoryId: toRelationId(this.categoryId),
        providerId: toRelationId(this.providerId),
      };

      this.subscription$ = this.productService.postProduct(product).subscribe(
        res => {
          this.removeSubscription();
          this.modalInfoService.success(this.transloco.translate('products.created'), '');
          return this.modalCtrl.dismiss(res, 'created');
        },
        error => {
          console.log(error);
        }
      );
      return;
    }

    const product: ArticleCreate = {
      id: Number(this.product.id),
      name: this.name,
      code: this.code,
      stock: this.stock,
      price: this.price,
      priceSell: this.price_sell,
      description: this.description,
      categoryId: toRelationId(this.categoryId),
      providerId: toRelationId(this.providerId),
    };
    this.subscription$ = this.productService.putProduct(this.product.id, product).subscribe(
      res => {
        this.removeSubscription();
        this.modalInfoService.success(this.transloco.translate('products.updated'), '');
        return this.modalCtrl.dismiss(res, 'updated');
      },
      error => {
        console.log(error);
      }
    );
  }

  changeName(event: string) {
    this.name = event;
    this.didSomeChange = true;
  }

  changeCode(event: string) {
    this.code = event;
    this.didSomeChange = true;
  }

  changeStock(event: string) {
    this.stock = event;
    this.didSomeChange = true;
  }

  changePrice(event: string) {
    this.price = event;
    this.didSomeChange = true;
  }

  changePriceSell(event: string) {
    this.price_sell = event;
    this.didSomeChange = true;
  }

  changeDescription(event: string) {
    this.description = event;
    this.didSomeChange = true;
  }

  changeSelect(event: string) {
    this.categoryId = event;
    this.didSomeChange = true;
  }

  changeProvider(event: string) {
    this.providerId = event;
    this.didSomeChange = true;
  }

  fillEmptyForm() {
    if (!this.price) {
      if (this.price_sell) {
        this.price = this.price_sell;
      }
    }

    if (!this.price_sell) {
      if (this.price) {
        this.price_sell = this.price;
      }
    }

    if (!this.description) {
      this.description = '';
    }
  }

  removeSubscription() {
    this.subscription$?.unsubscribe();
    this.subscriptionCategories$?.unsubscribe();
    this.subscriptionProviders$?.unsubscribe();
    this.name = '';
    this.code = '';
    this.stock = '';
    this.price = '';
    this.price_sell = '';
    this.description = '';
    this.product = null;
  }

  ngOnDestroy(): void {
    this?.removeSubscription();
  }
}

/** Not picked keeps what the product has, the empty option takes it off */
function toRelationId(value?: string): number | null | undefined {
  if (value === undefined || value === null) return undefined;
  return value === '' ? null : Number(value);
}

/** 0 is a real stock, the product ran out; empty, negative or fractional is not */
export function isStock(value: unknown): boolean {
  if (value === null || value === undefined || String(value).trim() === '') return false;
  const units = Number(value);
  return Number.isInteger(units) && units >= 0;
}
