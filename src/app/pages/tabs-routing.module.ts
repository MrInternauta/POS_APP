import { inject, NgModule } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';

import { selectCanManage, selectStore } from '../auth/state';
import { TabsPage } from './tabs.page';

/**
 * The API refuses the reports to anyone else; this keeps them from landing on an empty page.
 * It reads the store, like the tab button does: right after a login the store already has the
 * user while AuthService's own copy may not.
 */
const adminOnly: CanActivateFn = () => {
  const router = inject(Router);
  return inject(Store)
    .select(selectCanManage)
    .pipe(
      take(1),
      map(canManage => canManage || router.createUrlTree(['/tabs/tab2']))
    );
};

/** Every tab works inside a store: someone without one is taken to open theirs */
const storeRequired: CanActivateFn = () => {
  const router = inject(Router);
  return inject(Store)
    .select(selectStore)
    .pipe(
      take(1),
      map(store => !!store || router.createUrlTree(['/store', 'new']))
    );
};

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [storeRequired],
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
        //It answers from the reports, which the API only gives an admin
        canActivate: [adminOnly],
        path: 'assistant',
        loadChildren: () => import('./assistant/assistant.module').then(m => m.AssistantPageModule),
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
