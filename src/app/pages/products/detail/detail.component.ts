import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { WorkoutService } from '../services/workout.service';
import { ModalInfoService } from '../../../core/services/modal.service';
import { Subscription } from 'rxjs';
import { Article } from '../models';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnDestroy, OnInit {
  @Input('product') product?: Article | null = null;

  name!: string;
  code!: string;
  stock!: string;
  price!: string;
  price_sell!: string;
  description!: string;
  subscription$!: Subscription;
  constructor(
    private productService: WorkoutService,
    private modalInfoService: ModalInfoService,
    private modalCtrl: ModalController
  ) {}

  get isValidForm() {
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

    return true;
  }

  ngOnInit(): void {
    console.log(this.product);
    if (this.product) {
      this.name = this.product?.name;
      this.code = this.product?.code;
      this.stock = this.product?.stock;
      this.price = this.product?.price;
      this.price_sell = this.product?.priceSell;
      this.description = this.product?.description;
    }
  }

  cancel() {
    this.removeSubscription();
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.fillEmptyForm();

    if (!this.product) {
      const product = {
        name: this.name,
        code: this.code,
        stock: this.stock,
        price: this.price,
        priceSell: this.price_sell,
        description: this.description,
      };
      this.subscription$ = this.productService.postProduct(product).subscribe(
        (res) => {
          this.removeSubscription();
          this.modalInfoService.success('Product was Created!', '');
          return this.modalCtrl.dismiss(this.name, 'confirm');
        },
        (error) => {
          console.log(error);
        }
      );
      return;
    }

    const product = {
      id: Number(this.product.id),
      name: this.name,
      code: this.code,
      stock: this.stock,
      price: this.price,
      priceSell: this.price_sell,
      description: this.description,
    };
    this.subscription$ = this.productService
      .putProduct(this.product.id, product)
      .subscribe(
        (res) => {
          this.removeSubscription();
          this.modalInfoService.success('Product was Updated!', '');
          return this.modalCtrl.dismiss(this.name, 'confirm');
        },
        (error) => {
          console.log(error);
        }
      );
  }

  changeName(event: string) {
    this.name = event;
  }

  changeCode(event: string) {
    this.code = event;
  }

  changeStock(event: string) {
    this.stock = event;
  }

  changePrice(event: string) {
    this.price = event;
  }

  changePriceSell(event: string) {
    this.price_sell = event;
  }

  changeDescription(event: string) {
    this.description = event;
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
