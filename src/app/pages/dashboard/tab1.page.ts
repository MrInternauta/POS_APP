import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RefresherCustomEvent } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { OrderResponse } from './models/order.model';
import { OrderService } from './services/order.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, OnDestroy {
  public historyWorkout: OrderResponse[] = [];
  private subscription$!: Subscription;
  constructor(
    private orderService: OrderService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  /**
   * Ionic keeps the page alive between visits, so ngOnInit does not run again. Reloading on every
   * entry is what brings the order that was just paid into the history.
   */
  ionViewWillEnter(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.subscription$?.unsubscribe();
    this.historyWorkout = [];
  }

  loadOrders(onDone?: () => void): void {
    this.subscription$?.unsubscribe();
    this.subscription$ = this.orderService.getOrders().subscribe(
      response => {
        this.historyWorkout = response?.orders || [];
        onDone?.();
      },
      () => onDone?.()
    );
  }

  /** Pull to refresh, for a sale made somewhere else */
  refreshOrders(event: RefresherCustomEvent): void {
    this.loadOrders(() => event.target.complete());
  }

  public trackByOrder(_index: number, order: OrderResponse) {
    return order?.id;
  }

  public onItemClicked(item: OrderResponse): void {
    this.orderService.itemSelected = item;
    this.router.navigate(['tabs', 'tab1', 'order']);
  }
}
