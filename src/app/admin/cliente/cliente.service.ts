import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Cliente } from './cliente';
import swal from 'sweetalert2';
import { Cita } from '../cita/agenda-cita/cita';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {


  private urlEndpoint: string = 'http://localhost:8085/api/clientes'

  constructor(private http: HttpClient, private router: Router) { }
  private _cliente: Cliente;

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndpoint + '/page/' + page).pipe(
      map((response: any) => {
        (response.content as Cliente[])
        return response;
      }
      )
    );
  }

  getAllClientes(): Observable<any> {
    return this.http.get(`${this.urlEndpoint}`).pipe(
      map((response: any) => {
        return (response as Cliente[]).map(
          cliente => {
            cliente.nameFull = `${cliente.nombre} ${cliente.apellido}`;
            return cliente;
          }
        )
      }
      )
    );
  }

  getCitasByCliente(id: number): Observable<any> {
    return this.http.get(`${this.urlEndpoint}/citas/${id}`).pipe(
      map((response: any) => {
        return (response as Cita[])
      }
      )
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndpoint, cliente)
      .pipe(map((response: any) => response.cliente as Cliente),
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

  getApiCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
        }
        swal.fire('Error al obtener', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id: number) {
    return this.getApiCliente(id).subscribe(cliente => {
      this._cliente = cliente as Cliente
      return this._cliente;
    });
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlEndpoint}/${cliente.id}`, cliente)
      .pipe(map((response: any) => response.cliente as Cliente),
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

}
