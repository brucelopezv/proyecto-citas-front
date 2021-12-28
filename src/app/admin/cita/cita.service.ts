import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Cita } from './agenda-cita/cita';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private urlEndpoint: string = 'http://localhost:8085/api/citas'

  constructor(private http: HttpClient, private router: Router) { }


  getApiAllCitas(): Observable<any> {
    return this.http.get(`${this.urlEndpoint}`).pipe(
      map((response: any) => {
        return response as Cita[]
      }
      )
    );
  }

  getCitasReporteMedico(): Observable<any> {
    return this.http.get(`${this.urlEndpoint}/medicos`).pipe(
      map((response: any) => {
        return response;
      }
      )
    );
  }

  getCitasReporteMedicoFecha(inicio: String, fin: String): Observable<any> {
    return this.http.get(`${this.urlEndpoint}/medicos/${inicio}/${fin}`).pipe(
      map((response: any) => {
        return response;
      }
      )
    );
  }

  getCitasReporteEstadosFecha(inicio: String, fin: String): Observable<any> {
    return this.http.get(`${this.urlEndpoint}/estados/${inicio}/${fin}`).pipe(
      map((response: any) => {
        return response;
      }
      )
    );
  }

  getCitasReporteServicioFecha(inicio: String, fin: String): Observable<any> {
    return this.http.get(`${this.urlEndpoint}/servicios/${inicio}/${fin}`).pipe(
      map((response: any) => {
        return response;
      }
      )
    );
  }


  getCitasDay(): Observable<any> {
    return this.http.get(`${this.urlEndpoint}/hoy`).pipe(
      map((response: any) => {
        return response as Cita[]
      }
      )
    );
  }

  create(cita: Cita): Observable<Cita> {
    return this.http.post(this.urlEndpoint, cita)
      .pipe(map((response: any) => response.cita as Cita),
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

  getCita(id): Observable<Cita> {
    return this.http.get<Cita>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/citas']);
        }
        swal.fire('Error al obtener', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cita: Cita): Observable<Cita> {
    return this.http.put<Cita>(`${this.urlEndpoint}/${cita.id}`, cita)
      .pipe(map((response: any) => response.cita as Cita),
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<Cita> {
    return this.http.delete<Cita>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

}
