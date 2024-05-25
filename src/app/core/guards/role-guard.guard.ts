import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '../../auth/services/auth.service';
import { UsuarioRoles } from '../models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardGuard implements CanActivate {
  constructor(
    public _UsuarioService: AuthService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const allowToContinue =
      await this._UsuarioService.currentUserAllowToContinue(
        route?.data['roles'] as Array<'ADMIN' | 'CASHIER' | 'CLIENT'>
      );
    if (!allowToContinue) {
      this.router.navigate([''], { replaceUrl: true });
      return false;
    }
    return allowToContinue;
  }
}
