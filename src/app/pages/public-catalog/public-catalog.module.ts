import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';

import { PublicCatalogPage } from './public-catalog.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TranslocoModule,
    RouterModule.forChild([{ path: '', component: PublicCatalogPage }]),
  ],
  declarations: [PublicCatalogPage],
})
export class PublicCatalogPageModule {}
