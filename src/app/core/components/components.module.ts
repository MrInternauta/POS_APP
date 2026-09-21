import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslocoModule } from '@jsverse/transloco';
import { PhoneMaskDirective } from '../directive/PhoneMask.directive';
import { ImagesPipe } from '../pipes/Image.pipe';
import { GetProfile } from '../pipes/getProfile.pipe';
import { AlertComponent } from './alert/alert.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ButtonComponent } from './button/button.component';
import { FilterPopoverComponent } from './filter-popover/filter-popover.component';
import { InputComponent } from './input/input.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { SelectComponent } from './select/select.component';
import { SlideToConfirmComponent } from './slide-to-confirm/slide-to-confirm.component';

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
    SlideToConfirmComponent,
  ],
  imports: [TranslocoModule, FormsModule, CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
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
    SlideToConfirmComponent,
  ],
})
export class ComponentsModule {}
