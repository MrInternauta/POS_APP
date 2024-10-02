import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ISelectItem } from '../../../core/models/iselect.item';
import { ModalInfoService } from '../../../core/services/modal.service';
import { PictureService } from '../../../core/services/picture.service';
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
  categoryId!: string;
  subscription$!: Subscription;
  subscriptionCategories$!: Subscription;
  categories!: Array<ISelectItem>;
  didSomeChange!: boolean;
  constructor(
    private productService: WorkoutService,
    private modalInfoService: ModalInfoService,
    private modalCtrl: ModalController,
    private pictureService: PictureService
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

    if (!this.stock) {
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
      this.categoryId = this.product?.categoryId;
      console.log(this.product);
    }
  }

  getImage() {
    if (!this.product?.id) {
      return;
    }

    this.pictureService.changePicture(this.product?.id ?? '', 'product');
  }

  getCategories() {
    this.subscriptionCategories$ = this.productService.getCategories().subscribe(categoriesResponse => {
      this.categories =
        categoriesResponse?.categories.map(item => {
          return {
            name: item.name,
            value: item.id.toString(),
            selected:
              item.id?.toString()?.toLocaleLowerCase() === this.product?.category?.id?.toString()?.toLocaleLowerCase(),
          };
        }) || [];
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
        categoryId: this.categoryId,
      };

      this.subscription$ = this.productService.postProduct(product).subscribe(
        res => {
          this.removeSubscription();
          this.modalInfoService.success('El producto fue creado!', '');
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
      categoryId: this.categoryId,
    };
    this.subscription$ = this.productService.putProduct(this.product.id, product).subscribe(
      res => {
        this.removeSubscription();
        this.modalInfoService.success('El producto fue actualizado!', '');
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
