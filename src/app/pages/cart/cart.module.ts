import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab2Page } from './cart.page';

import { TranslocoModule } from '@jsverse/transloco';
import { ComponentsModule } from '../../core/components/components.module';
import { Tab2PageRoutingModule } from './cart-routing.module';

@NgModule({
  imports: [TranslocoModule, IonicModule, CommonModule, FormsModule, Tab2PageRoutingModule, ComponentsModule],
  declarations: [Tab2Page],
})
export class Tab2PageModule {}
