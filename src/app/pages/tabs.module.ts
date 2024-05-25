import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from "ng-apexcharts";
import { FullCalendarModule } from '@fullcalendar/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { TabsPage } from './tabs.page';
import { ErrorPageComponent } from './error-page/error-page.component';
import { CommonLayoutComponent } from '../layouts/common-layout/common-layout.component';
import { ThemeConstantService } from '../shared/services/theme-constant.service';
import { TemplateModule } from '../shared/template/template.module';
import { SharedModule } from '../shared/shared.module';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule,
    TemplateModule,
    SharedModule,
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    AngularSvgIconModule.forRoot(),
  ],
  declarations: [TabsPage, ErrorPageComponent],
})
export class TabsPageModule {}
