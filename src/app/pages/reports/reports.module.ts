import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgApexchartsModule } from 'ng-apexcharts';

import { TranslocoModule } from '@jsverse/transloco';
import { ComponentsModule } from '../../core/components/components.module';
import { ReportsPageRoutingModule } from './reports-routing.module';
import { ReportsPage } from './reports.page';

@NgModule({
  imports: [TranslocoModule, IonicModule, CommonModule, ReportsPageRoutingModule, NgApexchartsModule, ComponentsModule],
  declarations: [ReportsPage],
})
export class ReportsPageModule {}
