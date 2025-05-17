import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Servicio } from './servicio';
import { ServicioService } from './servicio.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-form-servicio',
    templateUrl: './form-servicio.component.html',
    styleUrls: ['./form-servicio.component.css'],
    standalone: false
})
export class FormServicioComponent implements OnInit {

  public servicio: Servicio = new Servicio();
  public errores: string[];

  constructor(private serServicio: ServicioService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarServicio();
  }

  public cargarServicio(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.serServicio.getEspecialidad(id).subscribe(
          ((servicio) => this.servicio = servicio)
        )
      }
    })
  }

  public create(): void {
    this.serServicio.create(this.servicio).subscribe(
      servicio => {
        this.router.navigate(['/servicios']);
        swal.fire('Nuevo Registro', `El servicio: ${servicio.nombre} ha sido creado con exito`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
  }

  public update(): void {
    this.serServicio.update(this.servicio).subscribe(
      servicio => {
        this.router.navigate(['/especialidades']);
        swal.fire('Registro Actualizado', `El servicio: ${servicio.nombre} ha sido actualizado con exito`, 'success');
      }
    );
  }

}
