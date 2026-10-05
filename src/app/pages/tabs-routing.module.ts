import { inject, NgModule } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';

import { selectUser } from '../auth/state';
import { TabsPage } from './tabs.page';

/**
 * The API refuses the reports to anyone else; this keeps them from landing on an empty page.
 * It reads the store, like the tab button does: right after a login the store already has the
 * user while AuthService's own copy may not.
 */
const adminOnly: CanActivateFn = () => {
  const router = inject(Router);
  return inject(Store)
    .select(selectUser)
    .pipe(
      take(1),
      map(user => String(user?.role?.name ?? '').toUpperCase() === 'ADMIN' || router.createUrlTree(['/tabs/tab2']))
    );
};

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        // canActivate: [RoleGuardGuard],
        data: { roles: ['ADMIN'] },
        path: 'tab1',
        loadChildren: () => import('./dashboard/tab1.module').then(m => m.Tab1PageModule),
      },
      {
        // canActivate: [RoleGuardGuard],
        data: { roles: ['ADMIN', 'CASHIER', 'CLIENT'] },
        path: 'tab2',
        loadChildren: () => import('./products/tab2.module').then(m => m.Tab2PageModule),
      },
      {
        // canActivate: [RoleGuardGuard],
        data: { roles: ['ADMIN', 'CASHIER', 'CLIENT'] },
        path: 'tab3',
        loadChildren: () => import('./profile/tab3.module').then(m => m.Tab3PageModule),
      },
      {
        // canActivate: [RoleGuardGuard],
        data: { roles: ['ADMIN', 'CASHIER', 'CLIENT'] },
        path: 'tab4',
        loadChildren: () => import('./cart/cart.module').then(m => m.Tab2PageModule),
      },
      {
        canActivate: [adminOnly],
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/tab2',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab2',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
