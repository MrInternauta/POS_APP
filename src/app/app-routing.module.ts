import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { LoginGuardGuard, LogoutGuard } from './core';

const routes: Routes = [
  {
    canActivate: [LoginGuardGuard],
    path: '',
    loadChildren: () => import('./pages/tabs.module').then(m => m.TabsPageModule),
  },
  {
    canActivate: [LogoutGuard],
    path: 'authentication',
    children: [
      { path: '', redirectTo: 'login-1', pathMatch: 'full' },
      {
        path: 'login-1',
        loadChildren: () => import('./auth/pages/login/login.module').then(m => m.LoginPageModule),
      },
      {
        path: 'sign-up-1',
        loadChildren: () => import('./auth/pages/sign-up-1/sign-up-1.module').then(m => m.SignUpModule),
      },
      {
        path: 'forget-pass',
        loadChildren: () => import('./auth/pages/forget-pass/forget-pass.module').then(m => m.ForgetPassPageModule),
      },
    ],
  },
  {
    path: 'notfound',
    component: ErrorPageComponent,
  },
  {
    path: '**',
    redirectTo: 'notfound',
    pathMatch: 'full',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      //TODO: check what do these line
      preloadingStrategy: PreloadAllModules,
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
