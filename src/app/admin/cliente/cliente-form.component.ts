import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-cliente-form',
    templateUrl: './cliente-form.component.html',
    styleUrls: ['./cliente-form.component.css'],
    standalone: false
})
export class ClienteFormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  public errores: string[];
  public clientes: Cliente[];
  public clienteSeleccionado: Cliente;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private serv: ClienteService
  ) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  public cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.serv.getApiCliente(id).subscribe(
          ((cliente) => {
            this.cliente = cliente;
          })
        )
      }
    });
  }

  public create(): void {
    this.serv.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']);
        swal.fire('Nuevo Registro', `El cliente: ${cliente.nombre} ha sido creado con exito`, 'success');
      },
      err => {
        this.errores = err.errors as string[];
        swal.fire('Error', `No se pudo completar la solicitud`, 'warning');
      }
      
    );
  }

  public update(): void {
    this.serv.update(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']);
        swal.fire('Registro Actualizado', `El cliente: ${cliente.nombre} ha sido actualizado con exito`, 'success');
      }
    );
  }

  compararEspecialidad(o1: Cliente, o2: Cliente): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

}
