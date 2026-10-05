import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { TabsPageRoutingModule } from './tabs-routing.module';

import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TemplateModule } from '../shared/template/template.module';
import { ErrorPageComponent } from './error-page/error-page.component';
import { TabsPage } from './tabs.page';

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
