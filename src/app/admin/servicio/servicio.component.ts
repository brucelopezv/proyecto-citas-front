import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Servicio } from './servicio';
import { ServicioService } from './servicio.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-servicio',
    templateUrl: './servicio.component.html',
    styleUrls: ['./servicio.component.css'],
    standalone: false
})
export class ServicioComponent implements OnInit {
  paginador: any;
  servicioSeleccionado: Servicio;
  servicios: Servicio[];
  
  constructor(
    private serService: ServicioService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page')
      if (!page) {
        page = 0;
      }
      this.serService.getServicios(page).
        subscribe(
          response => {            
            this.servicios = response.content as Servicio[];
            this.paginador = response;
          }
        );
    })
  }


  delete(servicio: Servicio): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `Seguro que desea eliminar a la especialidad ${servicio.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.serService.delete(servicio.id).subscribe(
          response => {
            this.router.navigate(['/servicios']);
            this.servicios = this.servicios.filter(cli => cli !== servicio);
            swalWithBootstrapButtons.fire(
              'Servicio eliminado!',
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
    this.serService.getEspecialidad(id).subscribe(
      response => {
        this.servicioSeleccionado = response as Servicio;
        this.servicioSeleccionado.enabled = checked;
        this.serService.update(this.servicioSeleccionado).subscribe(
          especialidad => {
            this.router.navigate(['/servicios']);
            if (checked) {
              hab = 'habilitado';
            } else {
              hab = 'deshabilitado';
            }
            swal.fire('Servicio', `El servicio: ${especialidad.nombre}  ha sido ${hab} con exito`, 'success');
          }
        );
      }
    );
  }
}
