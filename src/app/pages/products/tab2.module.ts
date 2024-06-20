import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { ComponentsModule } from '../../core/components/components.module';
import { DetailComponent } from './detail/detail.component';
import { CoreModule } from '../../core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    ComponentsModule,
  ],
  declarations: [Tab2Page, DetailComponent],
  exports: [Tab2Page, DetailComponent],
})
export class Tab2PageModule {}
