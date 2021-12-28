import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Especialidad } from './especialidad';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private urlEndpoint: string = 'http://localhost:8085/api/especialidades'

  constructor(private http: HttpClient, private router: Router) { }


  getEspecialidades(page: number): Observable<any> {
    return this.http.get(this.urlEndpoint + '/page/' + page).pipe(
      map((response: any) => {
        (response.content as Especialidad[]).map(especialidad => {
          especialidad.nombre = especialidad.nombre.toUpperCase();
          return especialidad;
        });
        return response;
      }
      )
    );
  }

  cargarEspecialidadesByEnabled(): Observable<any> {
    return this.http.get(`${this.urlEndpoint}/enabled`).pipe(
      map((response: any) => {
        return (response as Especialidad[]);
      }
      )
    );
  }

  cargarEspecialidades(): Observable<any> {
    return this.http.get(this.urlEndpoint).pipe(
      map((response: any) => {
        return (response as Especialidad[]);
      }
      )
    );
  }

  create(especialidad: Especialidad): Observable<Especialidad> {
    return this.http.post(this.urlEndpoint, especialidad)
      .pipe(map((response: any) => response.especialidad as Especialidad),
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

  getEspecialidad(id): Observable<Especialidad> {
    return this.http.get<Especialidad>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/especialidades']);
        }
        swal.fire('Error al obtener', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(especialidad: Especialidad): Observable<Especialidad> {
    return this.http.put<Especialidad>(`${this.urlEndpoint}/${especialidad.id}`, especialidad)
      .pipe(map((response: any) => response.especialidad as Especialidad),
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<Especialidad> {
    return this.http.delete<Especialidad>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

}

