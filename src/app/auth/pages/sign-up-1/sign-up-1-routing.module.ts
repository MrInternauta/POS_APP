import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUp1Component } from './sign-up-1.component';

const routes: Routes = [
  {
    path: '',
    component: SignUp1Component
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpRoutingModule {}
