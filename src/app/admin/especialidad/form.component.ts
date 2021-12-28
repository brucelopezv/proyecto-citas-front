import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Especialidad } from './especialidad';
import { EspecialidadService } from './especialidad.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public especialidad: Especialidad = new Especialidad();
  public errores: string[];

  constructor(private espService: EspecialidadService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  public cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.espService.getEspecialidad(id).subscribe(
          ((especialidad) => this.especialidad = especialidad)
        )
      }
    })
  }

  public create(): void {
    this.espService.create(this.especialidad).subscribe(
      especialidad => {        
        this.router.navigate(['/especialidades']);
        swal.fire('Nuevo Registro', `La especialidad: ${especialidad.nombre} ha sido creada con exito`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];        
      }
    );
  }

  public update(): void {
    this.espService.update(this.especialidad).subscribe(
      especialidad => {        
        this.router.navigate(['/especialidades']);
        swal.fire('Registro Actualizado', `La especialidad: ${especialidad.nombre} ha sido actualizada con exito`, 'success');
      }
    );
  }



}
