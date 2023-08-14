import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { ComponentsModule } from '../../core/components/components.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab3PageRoutingModule,
    ComponentsModule,
    // CoreModule,
  ],
  declarations: [Tab3Page],
})
export class Tab3PageModule {}
