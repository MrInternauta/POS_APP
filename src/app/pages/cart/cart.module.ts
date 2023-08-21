import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './cart.page';

import { Tab2PageRoutingModule } from './cart-routing.module';
import { ComponentsModule } from '../../core/components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    ComponentsModule,
  ],
  declarations: [Tab2Page],
})
export class Tab2PageModule {}
