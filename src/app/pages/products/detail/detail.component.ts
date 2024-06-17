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

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
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

  removeSubscription() {
    this.subscription$.unsubscribe();
    this.name = '';
    this.code = '';
    this.stock = '';
    this.price = '';
    this.price_sell = '';
    this.description = '';
  }

  ngOnDestroy(): void {
    this.removeSubscription();
  }
}
