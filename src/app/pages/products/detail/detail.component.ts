import { Component, OnDestroy, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { WorkoutService } from '../services/workout.service';
import { ModalInfoService } from '../../../core/services/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnDestroy {
  @ViewChild(IonModal) modal!: IonModal;
  name!: string;
  code!: string;
  stock!: string;
  price!: string;
  price_sell!: string;
  description!: string;
  subscription$!: Subscription;
  constructor(
    private productService: WorkoutService,
    private modalInfoService: ModalInfoService
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

  cancel() {
    this.removeSubscription();
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.fillEmptyForm();
    this.subscription$ = this.productService
      .postProduct({
        name: this.name,
        code: this.code,
        stock: this.stock,
        price: this.price,
        priceSell: this.price_sell,
        description: this.description,
      })
      .subscribe(
        (res) => {
          this.removeSubscription();
          this.modalInfoService.success('Product was Created!', '');
          this.modal.dismiss(this.name, 'confirm');
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onWillDismiss(event: Event) {
    const ev = event;
    console.log(ev);

    // if (ev.detail.role === 'confirm') {
    //   this.message = `Hello, ${ev.detail.data}!`;
    // }
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
  }

  ngOnDestroy(): void {
    this?.removeSubscription();
  }
}
