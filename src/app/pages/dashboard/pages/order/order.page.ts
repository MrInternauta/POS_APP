import { Component, OnDestroy, OnInit } from '@angular/core';

import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit, OnDestroy {
  constructor(public orderService: OrderService) {}

  ngOnDestroy(): void {
    this.orderService.itemSelected = null;
  }

  ngOnInit() {
    return;
  }

  getTotal(priceSell: string = '', quantity?: number): number {
    if (!priceSell || !quantity) {
      return 0;
    }

    return parseFloat(priceSell) * quantity;
  }
}
