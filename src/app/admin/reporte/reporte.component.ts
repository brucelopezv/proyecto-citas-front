import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CitaService } from '../cita/cita.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {
  saleData = [
    { name: "Mobiles", value: 105000 },
    { name: "Laptop", value: 55000 },
    { name: "AC", value: 15000 },
    { name: "Headset", value: 150000 },
    { name: "Fridge", value: 20000 }
  ];
  pipe = new DatePipe('es-GT');
  inicio: Date;
  fin: Date;

  medData = [];
  estData = [];
  servData = [];  

  constructor(private citaService: CitaService) { }

  ngOnInit(): void {

  }


  getCitasMedicosReporteFecha() {
    this.estData = [];
    this.medData = [];
    this.servData = [];
    if (!this.isEmpty(this.fin) && !this.isEmpty(this.inicio)) {
      const fechaInicio = new Date(this.inicio);
      const fechaFin = new Date(this.fin);
      const fechaFinF = this.pipe.transform(fechaFin, 'dd-MM-YYYY');
      const fechaInicioF = this.pipe.transform(fechaInicio, 'dd-MM-YYYY');
      if (fechaFin >= fechaInicio) {
        this.getCitasReporteMedicos(fechaInicioF, fechaFinF);
        this.getCitasReporteServicios(fechaInicioF, fechaFinF);
        this.getCitasReporteEstados(fechaInicioF, fechaFinF);
      } else {
        Swal.fire('Reporte', 'Fecha inicio es menor a fecha fin', 'error');
      }
    } else {
      Swal.fire('Reporte', 'Seleccione fechas', 'error');
    }

  }

  getCitasReporteMedicos(fechaInicioF, fechaFinF) {
    this.citaService.getCitasReporteMedicoFecha(fechaInicioF, fechaFinF).subscribe(response => {
      for (var key in response) {
        var valor = response[key];
        this.medData.push({
          name: valor[0],
          value: valor[1]
        });
      }
    })
  }

  getCitasReporteEstados(fechaInicioF, fechaFinF) {
    this.citaService.getCitasReporteEstadosFecha(fechaInicioF, fechaFinF).subscribe(response => {
      console.log(response)
      for (var key in response) {
        var valor = response[key];
        this.estData.push({
          name: valor[0],
          value: valor[1]
        });
      }
    })
  }

  getCitasReporteServicios(fechaInicioF, fechaFinF) {
    this.citaService.getCitasReporteServicioFecha(fechaInicioF, fechaFinF).subscribe(response => {
      for (var key in response) {
        var valor = response[key];
        this.servData.push({
          name: valor[0],
          value: valor[1]
        });
      }
    })
  }

  isEmpty(value) {
    if (typeof value === "undefined" || value === null || value === "null" || value === "") {
      return true;
    } else {
      return false;
    }
  }


}
