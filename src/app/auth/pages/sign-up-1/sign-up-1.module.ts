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

import { SignUpRoutingModule } from './sign-up-1-routing.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ComponentsModule } from '../../../core/components/components.module';
import { SignUp1Component } from './sign-up-1.component';
import { ModalInfoService } from '../../../core/services/modal.service';


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
    SignUpRoutingModule,
    ComponentsModule,
    ...antdModule
  ],
  declarations: [SignUp1Component],
  providers:[    ModalInfoService ]
})
export class SignUpModule {}
