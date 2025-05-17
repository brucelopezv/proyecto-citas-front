import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MetodoPago } from './metodo-pago';
import { MetodoPagoService } from './metodo-pago.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-metodo-pago',
    templateUrl: './metodo-pago.component.html',
    styleUrls: ['./metodo-pago.component.css'],
    standalone: false
})
export class MetodoPagoComponent implements OnInit {

  paginador: any;
  metodoSeleccionado: MetodoPago;
  metodos: MetodoPago[];

  constructor(
    private metService: MetodoPagoService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page')
      if (!page) {
        page = 0;
      }
      this.metService.getMetodos(page).
        subscribe(
          response => {
            this.metodos = response.content as MetodoPago[];
            this.paginador = response;
          }
        );
    })
  }

  delete(metodo: MetodoPago): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `Seguro que desea eliminar el metodo de pago:  ${metodo.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.metService.delete(metodo.id).subscribe(
          response => {
            this.router.navigate(['/metodos']);
            this.metodos = this.metodos.filter(cli => cli !== metodo);
            swalWithBootstrapButtons.fire(
              'Metodo de pago eliminado!',
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
    this.metService.getMetodo(id).subscribe(
      response => {
        console.log(response);
        this.metodoSeleccionado = response as MetodoPago;
        this.metodoSeleccionado.enabled = checked;
        this.metService.update(this.metodoSeleccionado).subscribe(
          metodo => {
            this.router.navigate(['/metodos']);
            if (checked) {
              hab = 'habilitado';
            } else {
              hab = 'deshabilitado';
            }
            swal.fire('Servicio', `El Metodo de pago: ${metodo.nombre}  ha sido ${hab} con exito`, 'success');
          }
        );
      }
    );
  }

}
