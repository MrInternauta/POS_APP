import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginGuardGuard, LogoutGuard } from '@gymTrack/core';
import { CommonLayout_ROUTES } from './shared/routes/common-layout.routes';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';

const routes: Routes = [
  // {
  //   canActivate: [LoginGuardGuard],
  //   path: '',
  //   loadChildren: () =>
  //     import('./pages/tabs.module').then((m) => m.TabsPageModule),
  // },
  {
    path: '',
    component: CommonLayoutComponent,
    children: CommonLayout_ROUTES
  },
  {
    canActivate: [LogoutGuard],
    path: 'authentication',
    children: [
      { path: '', redirectTo: '/authentication/login-1', pathMatch: 'full' },
      {
        path: 'login-1',
        loadChildren: () =>
          import('./auth/pages/login/login.module').then(
            (m) => m.LoginPageModule
          ),
      },
      {
        path: 'sign-up-1',
        loadChildren: () =>
          import('./auth/pages/sign-up-1/sign-up-1.module').then(
            (m) => m.SignUpModule
          ),
      },
      {
        path: 'forget-pass',
        loadChildren: () =>
          import('./auth/pages/forget-pass/forget-pass.module').then(
            (m) => m.ForgetPassPageModule
          ),
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/notfound',
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
