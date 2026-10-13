import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { selectCanManage } from '../auth/state';
import { AppState } from '../core/state/app.reducer';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  //Only whoever runs the store gets the reports and assistant tabs, the API answers nobody else
  public isAdmin$: Observable<boolean> = this.store.select(selectCanManage);

  constructor(private store: Store<AppState>) {}
}
