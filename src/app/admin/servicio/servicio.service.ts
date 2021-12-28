import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Servicio } from './servicio';
import swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private urlEndpoint: string = 'http://localhost:8085/api/servicios'

  constructor(private http: HttpClient, private router: Router) { }


  getServicios(page: number): Observable<any> {
    return this.http.get(this.urlEndpoint + '/page/' + page).pipe(
      map((response: any) => {
        (response.content as Servicio[])
        return response;
      }
      )
    );
  }

  cargarServiciosByEnabled(): Observable<any> {
    return this.http.get(`${this.urlEndpoint}/enabled`).pipe(
      map((response: any) => {
        return (response as Servicio[]);
      }
      )
    );
  }

  cargarServicios(): Observable<any> {
    return this.http.get(this.urlEndpoint).pipe(
      map((response: any) => {
        return (response as Servicio[]);
      }
      )
    );
  }

  create(servicio: Servicio): Observable<Servicio> {
    return this.http.post(this.urlEndpoint, servicio)
      .pipe(map((response: any) => response.servicio as Servicio),
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

  getEspecialidad(id): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/especialidades']);
        }
        swal.fire('Error al obtener', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.urlEndpoint}/${servicio.id}`, servicio)
      .pipe(map((response: any) => response.servicio as Servicio),
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<Servicio> {
    return this.http.delete<Servicio>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
