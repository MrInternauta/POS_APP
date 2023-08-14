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
    path: 'login',
    loadChildren: () =>
      import('./auth/pages/login/login.module').then((m) => m.LoginPageModule),
  },
  { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
