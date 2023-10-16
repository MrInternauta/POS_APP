import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginGuardGuard, LogoutGuard } from '@gymTrack/core';

const routes: Routes = [
  {
    canActivate: [LoginGuardGuard],
    path: '',
    loadChildren: () =>
      import('./pages/tabs.module').then((m) => m.TabsPageModule),
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
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
