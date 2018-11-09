import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (typeof (Storage) !== "undefined") {
      if (sessionStorage.getItem('sessionInfo')) {
        const expectedRoles = route.data.expectedRoles;
        const role = JSON.parse(sessionStorage.getItem('sessionInfo')).tenantType;
        if (expectedRoles.indexOf(role) > -1 || expectedRoles.indexOf(role) > -1)
          return Promise.resolve(true);
        else {
          this.router.navigate(['/pages/dashboard']);
          return Promise.resolve(true);
        }
      }
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return Promise.resolve(false);
  }
}
