import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { IonicModule } from '@ionic/angular';

import { ForgetPassRoutingModule } from './forget-pass-routing.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ComponentsModule } from '../../../core/components/components.module';
import { ForgetPassComponent } from './forget-pass.component';


const antdModule = [
  NzFormModule,
  NzInputModule,
  NzButtonModule,
  NzCardModule,
  NzIconModule,
  NzCheckboxModule,
  AngularSvgIconModule.forRoot(),
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ForgetPassRoutingModule,
    ComponentsModule,
    ...antdModule
  ],
  declarations: [ForgetPassComponent],
})
export class ForgetPassPageModule {}
