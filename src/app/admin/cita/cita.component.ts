import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment'
import { Medico } from '../medico/medico';
import { MedicoService } from '../medico/medico.service';
import { MetodoPagoService } from '../metodo-pago/metodo-pago.service';
import { ServicioService } from '../servicio/servicio.service';
import { Cita } from './agenda-cita/cita';
import { ModalService } from './agenda-cita/modal.service';
import { CitaService } from './cita.service';
import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.css'],
})
export class CitaComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  public medicos: Medico[];
  public medico: Medico = new Medico();
  public citas: Cita[];
  public citasHoy: Cita[];
  public eventos: CalendarEvent[] = [];

  week: any = [

    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado"
  ];

  monthSelect: any[];
  dateSelect: any;
  dateValue: any;
  today: any;
  actualMonth: any;
  fechaActual: any;
  pipe = new DatePipe('es-GT'); // Use your own locale


  constructor(
    private modalaService: NgbModal,
    private medService: MedicoService,
    private metService: MetodoPagoService,
    private serService: ServicioService,
    private modalService: ModalService,
    private citaService: CitaService,
    private modal: NgbModal,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getTodasCitas();
    this.getCitasDelDia();
  }


  getTodasCitas() {
    this.citaService.getApiAllCitas().subscribe(response => {
      this.citas = response as Cita[];
      for (let cita of this.citas) {
        var colorCita;
        var fechaInicio = cita.fechaCita + ' ' + cita.horaInicio;
        var fechaFin = cita.fechaCita + ' ' + cita.horaFin;
        var fechaI = new Date(fechaInicio);
        var fechaF = new Date(fechaFin);
        if (cita.estado.descripcion === 'PENDIENTE') {
          colorCita = colors.blue;
        }
        if (cita.estado.descripcion === 'COMPLETADA') {
          colorCita = colors.yellow;
        }
        if (cita.estado.descripcion === 'CANCELADA') {
          colorCita = colors.red;
        }
        this.eventos.push(
          {
            start: fechaI,
            end: fechaF,
            color: colorCita,
            title: `${cita.cliente.nombre} - ${this.pipe.transform(fechaI, 'short')}`,
            meta: {
              id: cita
            }
          }
        )
      }
    })
  }

  update(cita: Cita, estado) {
    var es = '';
    if (estado == 2) {      
      cita.estado = { id: 2, descripcion: 'COMPLETADA' }
      es = 'completada';

    }
    if (estado == 3) {      
      cita.estado = { id: 3, descripcion: 'CANCELADA' }
      es = 'cancelada';
    }
    this.citaService.update(cita).subscribe(
      cita => {
        this.router.navigate(['/citas']);
        swal.fire('Registro Actualizado', `La cita de: ${cita.cliente.nombre} ha sido ${es} con exito`, 'success');
      }
    );
  }

  getCitasDelDia() {
    this.citaService.getCitasDay().subscribe(response => {
      this.citasHoy = response as Cita[];
    })
  }



  refresh: Subject<any> = new Subject();



  activeDayIsOpen: boolean = false;


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }



  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }


}
