import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Usuario } from './usuario';
import { catchError, timeout } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlEndpoint: string = 'http://localhost:8085/oauth/token'
  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }

  login(usuario: Usuario): Observable<any> {
    const credenciales = btoa('proyectocitas' + ':' + '12345');
    const httpHeaders = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.usuario);
    params.set('password', usuario.pass);
    return this.http.post<any>(this.urlEndpoint, params.toString(), { headers: httpHeaders }).pipe(
      timeout(2000), catchError(e => {
        return throwError(e);
      })
    )
  }

  guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.usuario = payload.user_name;
    this._usuario.id = payload.id;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', this._token);
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      let json = JSON.parse(atob(accessToken.split(".")[1]));
      return json;
    }
    return null;
  }

  public getUsuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      const sUsuario = sessionStorage.getItem('usuario');
      this._usuario = sUsuario !== null ? JSON.parse(sUsuario) as Usuario : new Usuario();
      return this._usuario;
    }
    return new Usuario();
  }

  public getToken(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token') as string; 
      return this._token;
    }
    return null;
  }

  isAuthenticaded(): boolean {
    let payload = this.obtenerDatosToken(this.getToken());
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  hasRole(role: string): boolean {
    if (this.getUsuario().roles.includes(role)) {
      return true;
    }
    return false;
  }

  logout() {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
  }

}
