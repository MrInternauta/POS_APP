import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../../../core/components/components.module';
import { OrderPageRoutingModule } from './order-routing.module';
import { OrderPage } from './order.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, OrderPageRoutingModule, ComponentsModule],
  declarations: [OrderPage],
})
export class OrderPageModule {}
