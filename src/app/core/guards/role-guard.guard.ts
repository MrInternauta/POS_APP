import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardGuard implements CanActivate {
  constructor(
    public _UsuarioService: AuthService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {}
  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const allowToContinue = await this._UsuarioService.currentUserAllowToContinue(
      route?.data['roles'] as Array<'ADMIN' | 'CASHIER' | 'CLIENT'>
    );
    if (!allowToContinue) {
      this.router.navigate(['authentication', 'login-1'], { replaceUrl: true });
      return false;
    }
    return true;
  }
}
