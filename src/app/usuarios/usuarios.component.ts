import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2'
import { AuthService } from './auth.service';
import { Router } from '@angular/router';



@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.css'],
    standalone: false
})
export class UsuariosComponent implements OnInit {

  usuario: Usuario;
  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticaded()) {
      Swal.fire('Login', `Hola ${this.authService.getUsuario().nombre} ya estas autenticado`, 'info');
      this.router.navigate(['/inicio']);
    }
  }

  login(): void {
    if (this.usuario.usuario == null || this.usuario.pass == null) {
      Swal.fire('Error Login', 'Usuario o contraseña vació', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(response => {
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario = this.authService.getUsuario();
      this.router.navigate(['/inicio']);
      Swal.fire('Login', `Hola ${usuario.usuario} has iniciado sesión con éxito`, 'info');
    },
      err => {
        console.log(err);
        if (err.status == 400) {
          Swal.fire('Login', 'usuario o contraseña invalidos', 'error');
        }
        else if (err.name == 'TimeoutError') {
          Swal.fire({
            title: 'Error',
            text: 'La solicitud ha excedido el tiempo de espera, por favor intente mas tarde',
            icon: 'error'
          });
        } else {
          Swal.fire('Login', 'Ha ocurrido un error, por favor intente más tarde', 'error');
        }
      }
    );
  }
}