import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError(e => {
                if (e.status == 401) {
                    if (this.authService.isAuthenticaded()) {
                        this.authService.logout();
                    }
                    this.router.navigate(['/usuarios']);
                }
                if (e.status == 403) {
                    swal.fire('Acceso Denegado', `${this.authService.getUsuario().nombre} no tienes acceso al recurso`, 'warning')
                    this.router.navigate(['/catalogos']);
                }
                return throwError(e);
            })
        );
    }
}