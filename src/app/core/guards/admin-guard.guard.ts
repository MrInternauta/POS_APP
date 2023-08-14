import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../../auth/services/auth.service';
import { UsuarioRoles } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AdminGuardGuard implements CanActivate {
  constructor(public _UsuarioService: AuthService, public router: Router) {}
  async canActivate() {
    if (
      (await this._UsuarioService.hasSession()) &&
      this._UsuarioService.user &&
      this._UsuarioService.user.cargo === UsuarioRoles.ADMIN
    ) {
      return true;
    } else {
      return false;
    }
  }
}
