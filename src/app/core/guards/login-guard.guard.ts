import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuardGuard implements CanActivate {
  constructor(public _UsuarioService: AuthService, public router: Router) {}
  async canActivate() {
    if (await this._UsuarioService.hasSession()) {
      return true;
    } else {
      this.router.navigate(['/authentication/login-1']);
      return false;
    }
  }
}
