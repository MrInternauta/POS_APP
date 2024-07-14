import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LogoutGuard implements CanActivate {
  constructor(
    public _UsuarioService: AuthService,
    public router: Router
  ) {}
  async canActivate(): Promise<boolean | UrlTree> {
    try {
      const sessionStorage = await this._UsuarioService.hasSession();
      console.log('logout session', sessionStorage);
      if (!sessionStorage) {
        return true;
      }
      this.router.navigate(['tabs', 'tab2'], { replaceUrl: true });
      return false;
    } catch (error) {
      return false;
    }
  }
}
