import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule, LoginGuardGuard, RoleGuardGuard } from '@gymTrack/core';

import { AuthService } from './services';

@NgModule({
  declarations: [],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CoreModule, BrowserAnimationsModule],
  providers: [AuthService, LoginGuardGuard, RoleGuardGuard],
})
export class AuthModule {}
