import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AdminStore } from './store.model';
import { StoreService } from './store.service';

/** Every store on the platform, for the super admin: switch one on or off, or enter it */
@Component({
  selector: 'app-admin-stores',
  templateUrl: './admin-stores.component.html',
  styleUrls: ['./team.component.scss'],
})
export class AdminStoresComponent implements OnInit {
  stores: AdminStore[] = [];
  total = 0;
  loading = false;

  constructor(
    private storeService: StoreService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.storeService.allStores().subscribe({
      next: ({ stores, total }) => {
        this.loading = false;
        this.stores = stores;
        this.total = total;
      },
      error: () => (this.loading = false),
    });
  }

  trackById(_index: number, store: AdminStore) {
    return store.id;
  }

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  toggle(store: AdminStore, event: Event) {
    const active = (event as CustomEvent).detail.checked as boolean;
    this.storeService.setActive(store.id, active).subscribe({
      next: () => (store.active = active),
      //Puts the toggle back where the API left it
      error: () => (store.active = !active),
    });
  }

  /** The profile does the switching: it holds the session */
  enter(store: AdminStore) {
    return this.modalCtrl.dismiss(store.id, 'enter');
  }
}
