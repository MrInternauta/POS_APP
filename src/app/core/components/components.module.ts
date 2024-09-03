import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PhoneMaskDirective } from '../directive/PhoneMask.directive';
import { GetProfile } from '../pipes/getProfile.pipe';
import { ImagesPipe } from '../pipes/Image.pipe';
import { AlertComponent } from './alert/alert.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ButtonComponent } from './button/button.component';
import { FilterPopoverComponent } from './filter-popover/filter-popover.component';
import { InputComponent } from './input/input.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { SelectComponent } from './select/select.component';

@NgModule({
  declarations: [
    ButtonComponent,
    AvatarComponent,
    InputComponent,
    AlertComponent,
    GetProfile,
    ImagesPipe,
    ProductItemComponent,
    PhoneMaskDirective,
    SelectComponent,
    FilterPopoverComponent,
    ProductCardComponent,
  ],
  imports: [FormsModule, CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  exports: [
    PhoneMaskDirective,
    ButtonComponent,
    AvatarComponent,
    InputComponent,
    AlertComponent,
    ProductItemComponent,
    SelectComponent,
    FilterPopoverComponent,
    ProductCardComponent,
  ],
})
export class ComponentsModule {}
