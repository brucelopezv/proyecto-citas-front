import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Medico } from './medico';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private urlEndpoint: string = 'http://localhost:8085/api/medicos'

  constructor(private http: HttpClient, private router: Router) { }

  getMedicos(page: number): Observable<any> {
    return this.http.get(this.urlEndpoint + '/page/' + page).pipe(
      map((response: any) => {
        (response.content as Medico[]).map(medico => {
          medico.nombre = medico.nombre.toUpperCase();
          medico.apellido = medico.apellido.toUpperCase();
          return medico;
        });
        return response;
      }
      )
    );
  }

  getMedicosEnabled(): Observable<any> {
    return this.http.get(`${this.urlEndpoint}/enabled`).pipe(
      map((response: any) => {        
        return (response as Medico[]);
      })
    );
  }

  getMedico(id): Observable<Medico> {
    return this.http.get<Medico>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/medicos']);
        }
        swal.fire('Error al obtener', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }


  create(medico: Medico): Observable<Medico> {
    return this.http.post(this.urlEndpoint, medico)
      .pipe(map((response: any) => response.medico as Medico),
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

  delete(id: number): Observable<Medico> {
    return this.http.delete<Medico>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  update(medico: Medico): Observable<Medico> {
    return this.http.put(`${this.urlEndpoint}/${medico.id}`, medico)
      .pipe(map((response: any) => response.medico as Medico),
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

}
