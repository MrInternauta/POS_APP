import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgChartsModule } from 'ng2-charts';

import { ComponentsModule } from '../../core/components/components.module';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { Tab1Page } from './tab1.page';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, Tab1PageRoutingModule, NgChartsModule, ComponentsModule],
  declarations: [Tab1Page],
})
export class Tab1PageModule {}
