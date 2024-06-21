import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { IonicModule } from '@ionic/angular';
import { AvatarComponent } from './avatar/avatar.component';
import { InputComponent } from './input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { GetProfile } from '../pipes/getProfile.pipe';
import { ProductItemComponent } from './product-item/product-item.component';
import { PhoneMaskDirective } from '../directive/PhoneMask.directive';
import { SelectComponent } from './select/select.component';

@NgModule({
  declarations: [
    ButtonComponent,
    AvatarComponent,
    InputComponent,
    AlertComponent,
    GetProfile,
    ProductItemComponent,
    PhoneMaskDirective,
    SelectComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    PhoneMaskDirective,
    ButtonComponent,
    AvatarComponent,
    InputComponent,
    AlertComponent,
    ProductItemComponent,
    SelectComponent,
  ],
})
export class ComponentsModule {}
