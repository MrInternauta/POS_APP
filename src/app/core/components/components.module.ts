import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { IonicModule } from '@ionic/angular';
import { AvatarComponent } from './avatar/avatar.component';
import { InputComponent } from './input/input.component';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { GetProfile } from '../pipes/getProfile.pipe';

@NgModule({
  declarations: [
    ButtonComponent,
    AvatarComponent,
    InputComponent,
    AlertComponent,
    GetProfile,
  ],
  imports: [FormsModule, CommonModule, IonicModule],
  exports: [ButtonComponent, AvatarComponent, InputComponent, AlertComponent],
})
export class ComponentsModule {}
