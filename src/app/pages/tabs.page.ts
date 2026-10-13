import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  //Only an admin gets the reports tab, the API answers nobody else
  public isAdmin$: Observable<boolean> = this.authService.user$.pipe(
    map(user => String(user?.role?.name ?? '').toUpperCase() === 'ADMIN')
  );

  constructor(private authService: AuthService) {}
}
