import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Medico } from './medico';
import { MedicoService } from './medico.service';

import swal from 'sweetalert2';
@Component({
    selector: 'app-medico',
    templateUrl: './medico.component.html',
    styleUrls: ['./medico.component.css'],
    standalone: false
})
export class MedicoComponent implements OnInit {

  medicos: Medico[];
  paginador: any;
  medSeleccionado: Medico;

  constructor(
    private medService: MedicoService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page')
      if (!page) {
        page = 0;
      }
      this.medService.getMedicos(page).
        subscribe(
          response => {
            this.medicos = response.content as Medico[];
            this.paginador = response;
          }
        );
    })
  }

  abrirModal(medico: Medico, modal) {
    console.log(medico);
    this.medSeleccionado = medico;
    this.modalService.open(modal)
  }


  cerrarModal(modal: any) {
    this.modalService.dismissAll();
  }


  delete(medico: Medico): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `Seguro que desea eliminar el médico ${medico.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.medService.delete(medico.id).subscribe(
          response => {
            this.router.navigate(['/medicos']);
            this.medicos = this.medicos.filter(cli => cli !== medico);
            swalWithBootstrapButtons.fire(
              'Medico eliminado!',
              'Se ha eliminado correctamente',
              'success'
            )
          })

      }
    })
  }

}
