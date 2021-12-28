import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MetodoPago } from './metodo-pago';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {

  private urlEndpoint: string = 'http://localhost:8085/api/metodos'

  constructor(private http: HttpClient, private router: Router) { }

  getMetodos(page: number): Observable<any> {
    return this.http.get(this.urlEndpoint + '/page/' + page).pipe(
      map((response: any) => {
        (response.content as MetodoPago[])
        return response;
      }
      )
    );
  }


  cargarServiciosByEnabled(): Observable<any> {
    return this.http.get(`${this.urlEndpoint}/enabled`).pipe(
      map((response: any) => {
        return (response as MetodoPago[]);
      }
      )
    );
  }

  cargarServicios(): Observable<any> {
    return this.http.get(this.urlEndpoint).pipe(
      map((response: any) => {
        return (response as MetodoPago[]);
      }
      )
    );
  }

  create(servicio: MetodoPago): Observable<MetodoPago> {
    return this.http.post(this.urlEndpoint, servicio)
      .pipe(map((response: any) => response.metodo as MetodoPago),
        catchError(e => {
          if (e.status == 400) {
            swal.fire('Error', e.errror.errors, 'error');
            return throwError(e);
          }
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e)
        })
      );
  }

  getMetodo(id): Observable<MetodoPago> {
    return this.http.get<MetodoPago>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/metodos']);
        }
        swal.fire('Error al obtener', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(servicio: MetodoPago): Observable<MetodoPago> {
    return this.http.put<MetodoPago>(`${this.urlEndpoint}/${servicio.id}`, servicio)
      .pipe(map((response: any) => response.metodo as MetodoPago),
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<MetodoPago> {
    return this.http.delete<MetodoPago>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

}
