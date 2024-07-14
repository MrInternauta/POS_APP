import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuardGuard implements CanActivate {
  constructor(
    public _UsuarioService: AuthService,
    public router: Router
  ) {}
  async canActivate() {
    const session = await this._UsuarioService.hasSession();
    console.log('login session', session);
    if (session) {
      return true;
    } else {
      this.router.navigate(['authentication', 'login-1']);
      return false;
    }
  }
}
