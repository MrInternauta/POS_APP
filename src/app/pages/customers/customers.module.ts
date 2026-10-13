import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';

import { CustomersComponent } from './customers.component';

/** The customers modal, shared by the cart (to pick one) and the profile (to manage them) */
@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, TranslocoModule],
  declarations: [CustomersComponent],
  exports: [CustomersComponent],
})
export class CustomersModule {}
