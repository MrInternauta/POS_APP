

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoleGuardGuard, CoreModule, LoginGuardGuard } from '@gymTrack/core';

import { AuthService } from './services';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    BrowserAnimationsModule,
  ],
  providers: [AuthService, LoginGuardGuard, RoleGuardGuard],
})
export class AuthModule {}
