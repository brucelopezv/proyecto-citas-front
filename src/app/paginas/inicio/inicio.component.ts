import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Servicio } from 'src/app/admin/servicio/servicio';
import { ServicioService } from 'src/app/admin/servicio/servicio.service';

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css'],
    standalone: false
})
export class InicioComponent implements OnInit {
  servicios: Servicio[];
  constructor(private serService: ServicioService, private router: Router) { }

  ngOnInit(): void {
    this.serService.cargarServiciosByEnabled().
      subscribe(
        response => {
          console.log(response)
          this.servicios = response as Servicio[];
        }
      );
  }

}
