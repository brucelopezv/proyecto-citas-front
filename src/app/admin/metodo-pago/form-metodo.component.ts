import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MetodoPago } from './metodo-pago';
import { MetodoPagoService } from './metodo-pago.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form-metodo',
  templateUrl: './form-metodo.component.html',
  styleUrls: ['./form-metodo.component.css']
})
export class FormMetodoComponent implements OnInit {

  public metodo: MetodoPago = new MetodoPago();
  public errores: string[];

  constructor(private metService: MetodoPagoService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarMetodo();
  }

  public cargarMetodo(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.metService.getMetodo(id).subscribe(
          metodo => {
            this.metodo = metodo
          }
        )
      }
    })
  }

  public create(): void {
    this.metService.create(this.metodo).subscribe(
      metodo => {
        this.router.navigate(['/metodos']);
        swal.fire('Nuevo Registro', `El metodo de pago: ${metodo.nombre} ha sido creado con exito`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
      }
    );
  }

  public update(): void {
    this.metService.update(this.metodo).subscribe(
      metodo => {
        this.router.navigate(['/metodos']);
        swal.fire('Registro Actualizado', `El metodo de pago: ${metodo.nombre} ha sido actualizado con exito`, 'success');
      }
    );
  }


}
