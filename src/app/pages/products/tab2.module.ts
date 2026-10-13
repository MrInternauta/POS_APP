import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslocoModule } from '@jsverse/transloco';
import { ComponentsModule } from '../../core/components/components.module';
import { CatalogComponent } from './catalog/catalog.component';
import { DetailComponent } from './detail/detail.component';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { Tab2Page } from './tab2.page';

@NgModule({
  imports: [TranslocoModule, IonicModule, CommonModule, FormsModule, Tab2PageRoutingModule, ComponentsModule],
  declarations: [Tab2Page, DetailComponent, CatalogComponent],
  exports: [Tab2Page, DetailComponent],
})
export class Tab2PageModule {}
