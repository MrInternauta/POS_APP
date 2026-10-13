import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@jsverse/transloco';

import { AdminStoresComponent } from './admin-stores.component';
import { TeamComponent } from './team.component';

/** The modals the profile opens to run the store and, for a super admin, the platform */
@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, TranslocoModule],
  declarations: [TeamComponent, AdminStoresComponent],
  exports: [TeamComponent, AdminStoresComponent],
})
export class StoreManageModule {}
