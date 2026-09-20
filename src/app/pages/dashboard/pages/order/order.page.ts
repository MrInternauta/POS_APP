import { Component, OnDestroy, OnInit } from '@angular/core';

import { ItemResponse } from '../../models/order.model';
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

  trackByOrderItem(_index: number, item: ItemResponse) {
    return item?.id;
  }

  getTotal(priceSell: string = '', quantity?: number): number {
    if (!priceSell || !quantity) {
      return 0;
    }

    return parseFloat(priceSell) * quantity;
  }
}
