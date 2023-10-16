

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminGuardGuard, CoreModule, LoginGuardGuard } from '@gymTrack/core';

import { AuthService } from './services';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
  ],
  providers: [AuthService, LoginGuardGuard, AdminGuardGuard],
})
export class AuthModule {}
