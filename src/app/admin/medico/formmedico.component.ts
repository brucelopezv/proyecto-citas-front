import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Medico } from './medico';
import { MedicoService } from './medico.service';
import swal from 'sweetalert2';
import { EspecialidadService } from '../especialidad/especialidad.service';
import { Especialidad } from '../especialidad/especialidad';


@Component({
  selector: 'app-formmedico',
  templateUrl: './formmedico.component.html',
  styleUrls: ['./formmedico.component.css']
})
export class FormmedicoComponent implements OnInit {

  public medico: Medico = new Medico();
  public errores: string[];
  public especialidades: Especialidad[];
  public especialidadesSeleccionadas: Especialidad[];
  public esp: Especialidad;


  constructor(private medService: MedicoService, private router: Router, private activatedRoute: ActivatedRoute, private espService: EspecialidadService) { }

  ngOnInit(): void {
    this.cargarMedico();
  }

  public cargarMedico(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.medService.getMedico(id).subscribe(
          ((medico) => {
            this.medico = medico;
          })
        )
      }
    });
    this.espService.cargarEspecialidadesByEnabled().
      subscribe(
        response => {
          this.especialidades = response as Especialidad[];
        }
      );
  }

  public create(): void {
    this.medService.create(this.medico).subscribe(
      medico => {
        this.router.navigate(['/medicos']);
        swal.fire('Nuevo Registro', `El medico: ${medico.nombre} ha sido creado con exito`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
  }

  public update(): void {
    this.medService.update(this.medico).subscribe(
      medico => {
        this.router.navigate(['/medicos']);
        swal.fire('Registro Actualizado', `El medico: ${medico.nombre} ha sido actualizado con exito`, 'success');
      }
    );
  }

  compararEspecialidad(o1: Especialidad, o2: Especialidad): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

}
