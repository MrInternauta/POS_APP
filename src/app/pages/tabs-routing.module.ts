import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { ErrorPageComponent } from './error-page/error-page.component';
import { RoleGuardGuard } from '@gymTrack/core';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        canActivate: [RoleGuardGuard],
        data: { roles: ['ADMIN'] },
        path: 'tab1',
        loadChildren: () =>
          import('./statistics/tab1.module').then((m) => m.Tab1PageModule),
      },
      {
        canActivate: [RoleGuardGuard],
        data: { roles: ['ADMIN', 'CASHIER', 'CLIENT'] },
        path: 'tab2',
        loadChildren: () =>
          import('./workout/tab2.module').then((m) => m.Tab2PageModule),
      },
      {
        canActivate: [RoleGuardGuard],
        data: { roles: ['ADMIN', 'CASHIER', 'CLIENT'] },
        path: 'tab3',
        loadChildren: () =>
          import('./profile/tab3.module').then((m) => m.Tab3PageModule),
      },
      {
        canActivate: [RoleGuardGuard],
        data: { roles: ['ADMIN', 'CASHIER', 'CLIENT'] },
        path: 'tab4',
        loadChildren: () =>
          import('./cart/cart.module').then((m) => m.Tab2PageModule),
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
