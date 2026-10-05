import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription, switchMap, take, timer } from 'rxjs';

import { ItemRequest } from '../models/checkout';
import { Payment, PaymentsService, PaymentStatus } from '../services/payments.service';

const POLL_MS = 3000;

/**
 * Shown while the customer pays on the Point terminal. It sends the charge, asks the API every
 * 3 seconds how it stands, and closes with the final status as its role: `paid`, `failed`,
 * `canceled`, or `error` when the charge never reached the terminal.
 */
@Component({
  selector: 'app-point-payment',
  templateUrl: './point-payment.component.html',
})
export class PointPaymentComponent implements OnInit, OnDestroy {
  @Input() items: ItemRequest[] = [];
  @Input() total = 0;

  public payment: Payment | null = null;
  public canceling = false;
  /** A poll failed; the interceptor already said why, so this waits for the cashier instead of retrying */
  public lostTrack = false;

  private poll$?: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private paymentsService: PaymentsService
  ) {}

  ngOnInit(): void {
    this.paymentsService
      .charge(this.items)
      .pipe(take(1))
      .subscribe({
        next: payment => {
          this.payment = payment;
          this.watch();
        },
        error: () => this.close('error'),
      });
  }

  ngOnDestroy(): void {
    this.poll$?.unsubscribe();
  }

  watch(): void {
    this.lostTrack = false;
    this.poll$?.unsubscribe();
    this.poll$ = timer(0, POLL_MS)
      .pipe(switchMap(() => this.paymentsService.status(this.payment!.id)))
      .subscribe({
        next: payment => this.update(payment),
        error: () => (this.lostTrack = true),
      });
  }

  cancel(): void {
    if (!this.payment || this.canceling) {
      return;
    }
    this.canceling = true;
    this.paymentsService
      .cancel(this.payment.id)
      .pipe(take(1))
      .subscribe({
        //The customer may have paid just before; the answer says which happened
        next: payment => this.update(payment),
        error: () => (this.canceling = false),
      });
  }

  private update(payment: Payment): void {
    this.payment = payment;
    if (payment.paymentStatus !== 'pending') {
      this.close(payment.paymentStatus);
    }
  }

  private close(role: PaymentStatus | 'error'): void {
    this.poll$?.unsubscribe();
    this.modalCtrl.dismiss(this.payment, role);
  }
}
