import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { TranslocoModule } from '@jsverse/transloco';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ComponentsModule } from '../../../core/components/components.module';
import { ModalInfoService } from '../../../core/services/modal.service';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';

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
    TranslocoModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LoginPageRoutingModule,
    ComponentsModule,
    ...antdModule,
  ],
  declarations: [LoginPage],
  providers: [ModalInfoService],
})
export class LoginPageModule {}
