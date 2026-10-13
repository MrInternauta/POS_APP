import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab3Page } from './tab3.page';

import { TranslocoModule } from '@jsverse/transloco';
import { ComponentsModule } from '../../core/components/components.module';
import { CustomersModule } from '../customers/customers.module';
import { StoreManageModule } from '../store/store-manage.module';
import { Tab3PageRoutingModule } from './tab3-routing.module';

@NgModule({
  imports: [
    TranslocoModule,
    IonicModule,
    CommonModule,
    FormsModule,
    Tab3PageRoutingModule,
    ComponentsModule,
    CustomersModule,
    StoreManageModule,
  ],
  declarations: [Tab3Page],
})
export class Tab3PageModule {}
