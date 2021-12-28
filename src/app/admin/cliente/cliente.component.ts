import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { ModalService } from '../cita/agenda-cita/modal.service';
import { Cita } from '../cita/agenda-cita/cita';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {


  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    private serv: ClienteService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page')
      if (!page) {
        page = 0;
      }
      this.serv.getClientes(page).
        subscribe(
          response => {
            this.clientes = response.content as Cliente[];
            this.paginador = response;
          }
        );
    })
  }

  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `Seguro que desea eliminar al cliente ${cliente.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.serv.delete(cliente.id).subscribe(
          response => {
            this.router.navigate(['/clientes']);
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swalWithBootstrapButtons.fire(
              'Especialidad eliminada!',
              'Se ha eliminado correctamente',
              'success'
            )
          })

      }
    })
  }

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this.clienteSeleccionado.citas = [];
    this.serv.getCitasByCliente(cliente.id).subscribe(response => {
      this.clienteSeleccionado.citas = response as Cita[];
    })
    this.modalService.abrirModal();
  }

}
