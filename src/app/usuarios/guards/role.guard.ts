import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard  {

  constructor(private authService: AuthService, private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let role = route.data.role;
    if (!this.authService.isAuthenticaded) {
      this.router.navigate(['/usuarios']);
      return false;
    }
    for (let e in role) {
      if (this.authService.hasRole(role[e])) {
        return true;
      }
    }
    swal.fire('acceso denegado', 'No tienes acceso a este recurso', 'error')
    this.router.navigate(['/inicio']);
    return false;
  }

}
