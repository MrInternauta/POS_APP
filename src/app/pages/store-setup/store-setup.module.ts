import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';

import { StoreSetupPage } from './store-setup.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslocoModule,
    RouterModule.forChild([{ path: '', component: StoreSetupPage }]),
  ],
  declarations: [StoreSetupPage],
})
export class StoreSetupPageModule {}
