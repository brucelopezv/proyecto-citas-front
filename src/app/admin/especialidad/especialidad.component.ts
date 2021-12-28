import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Especialidad } from './especialidad';
import swal from 'sweetalert2';

import { EspecialidadService } from './especialidad.service';


@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  styleUrls: ['./especialidad.component.css']
})
export class EspecialidadComponent implements OnInit {

  especialidades: Especialidad[];
  paginador: any;
  espeSeleccionada: Especialidad;

  constructor(private espService: EspecialidadService,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page')
      if (!page) {
        page = 0;
      }
      this.espService.getEspecialidades(page).
        subscribe(
          response => {
            this.especialidades = response.content as Especialidad[];
            this.paginador = response;
          }
        );
    })
  }

  delete(especialidad: Especialidad): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `Seguro que desea eliminar a la especialidad ${especialidad.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.espService.delete(especialidad.id).subscribe(
          response => {
            this.router.navigate(['/especialidades']);
            this.especialidades = this.especialidades.filter(cli => cli !== especialidad);
            swalWithBootstrapButtons.fire(
              'Especialidad eliminada!',
              'Se ha eliminado correctamente',
              'success'
            )
          })

      }
    })
  }


  public onChangeEnabled($event) {
    const id = $event.target.value;
    const checked = $event.target.checked;
    let hab = '';
    this.espService.getEspecialidad(id).subscribe(
      response => {
        this.espeSeleccionada = response as Especialidad;
        this.espeSeleccionada.enabled = checked;
        this.espService.update(this.espeSeleccionada).subscribe(
          especialidad => {
            this.router.navigate(['/especialidades']);
            if (checked) {
              hab = 'habilitada';
            } else {
              hab = 'deshabilitada';
            }
            swal.fire('Especialidad', `La especialidad: ${especialidad.nombre}  ha sido ${hab} con exito`, 'success');
          }
        );
      }
    );
  }
}


