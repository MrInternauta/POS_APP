import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ConstantsHelper } from '../constants/constants.helper';
import { StorageService } from '../services';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LogoutGuard implements CanActivate {
  constructor(public _UsuarioService: AuthService, public router: Router) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    try {
      const sessionStorage = await this._UsuarioService.hasSession();

      if (!sessionStorage) {
        return true;
      }
      this.router.navigate([''], { replaceUrl: true });
      return false;
    } catch (error) {
      return false;
    }
  }
}
