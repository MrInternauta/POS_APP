import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgetPassComponent } from './forget-pass.component';

const routes: Routes = [
  {
    path: '',
    component: ForgetPassComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgetPassRoutingModule {}
