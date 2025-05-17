import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Cliente } from '../../cliente/cliente';
import { ClienteService } from '../../cliente/cliente.service';
import { Medico } from '../../medico/medico';
import { MedicoService } from '../../medico/medico.service';
import { MetodoPago } from '../../metodo-pago/metodo-pago';
import { MetodoPagoService } from '../../metodo-pago/metodo-pago.service';
import { Servicio } from '../../servicio/servicio';
import { ServicioService } from '../../servicio/servicio.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProgresoComponent } from 'src/app/progreso/progreso.component';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Cita } from './cita';
import moment from 'moment';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Usuario } from 'src/app/usuarios/usuario';
import { CitaService } from '../cita.service';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-cita-form',
    templateUrl: './cita-form.component.html',
    styleUrls: ['./cita-form.component.css'],
    standalone: false
})



export class CitaFormComponent implements OnInit, AfterViewInit {
  public errores: string[];
  public medicos: Medico[];
  public medico: Medico = new Medico();
  public servicios: Servicio[];
  public servicio: Servicio = new Servicio();
  public clientes: Cliente[];
  public clientesFiltrados: Cliente[];
  public cliente: Cliente = new Cliente();
  public metodo: MetodoPago = new MetodoPago();
  public metodos: MetodoPago[];
  public cita: Cita = new Cita();
  dropdownSettings: IDropdownSettings;
  public fechaForm;
  public horasForm;
  public infoForm;
  public clienteForm;
  public clienteSelectForm;
  public isChecked: boolean;
  public radio: any;
  private usuario: Usuario;

  constructor(
    private medService: MedicoService,
    private metService: MetodoPagoService,
    private cliService: ClienteService,
    private serv: ServicioService,
    private auth: AuthService,
    private citaService: CitaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  @ViewChild('selectList', { static: false }) selectList: ElementRef;

  ngOnInit(): void {
    this.isChecked = true;
    this.cargarMedicos();
    this.cargarServicios();
    this.cargarMetodos();
    this.cargarClientes();
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'nameFull',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      maxHeight: 100,
      searchPlaceholderText: 'Buscar'
    };
    this.fechaForm = new UntypedFormGroup({
      fecha: new UntypedFormControl('', [Validators.required, fechaRango])
    });
    this.horasForm = new UntypedFormGroup({
      horaInicio: new UntypedFormControl('', [Validators.required]),
      horaFin: new UntypedFormControl('', [Validators.required])
    }, {
      validators: horarios
    });
    this.infoForm = new UntypedFormGroup({
      medico: new UntypedFormControl(null, [Validators.required]),
      servicio: new UntypedFormControl(null, [Validators.required]),
      metodo: new UntypedFormControl(null, [Validators.required])
    })
    this.clienteForm = new UntypedFormGroup({
      nombre: new UntypedFormControl('', Validators.required),
      apellido: new UntypedFormControl('', Validators.required),
      correo: new UntypedFormControl('', Validators.required),
      fechaNacimiento: new UntypedFormControl('', Validators.required),
      telefono: new UntypedFormControl('', Validators.required),
      identificacion: new UntypedFormControl('')
    })
    this.clienteSelectForm = new UntypedFormGroup({
      cliente: new UntypedFormControl(null, Validators.required)
    })
    this.cargarCita();
  }

  public getScheduleType() {
    //Get the value of your stypeControl
    return this.clienteForm.controls['existe'].value;
  }

  cargarMedicos() {
    this.medService.getMedicosEnabled().
      subscribe(
        response => {
          this.medicos = response as Medico[];
        }
      );
  }

  cargarCita(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.citaService.getCita(id).subscribe(
          ((cita) => {
            this.isChecked = true;
            this.radio = 1;
            this.cita = cita;
            this.infoForm.patchValue({
              medico: this.cita.medico,
              servicio: this.cita.servicio,
              metodo: this.cita.metodoPago
            })
            this.clienteSelectForm.patchValue({
              cliente: [{
                id: this.cita.cliente.id,
                nameFull: `${this.cita.cliente.nombre} ${this.cita.cliente.apellido}`
              }]
            });
            this.horasForm.patchValue({
              horaInicio: this.cita.horaInicio.substring(0, 5),
              horaFin: this.cita.horaFin.substring(0, 5)
            });
            this.fechaForm.get("fecha").patchValue(moment(this.cita.fechaCita, 'YYYY-MM-DD'))
          })
        )
      }
    });
  }

  modificaCita() {
    this.cargaInformacionForm();
    if (this.clienteSelectForm.valid) {
      var id = this.clienteSelectForm.get('cliente').value;
      console.log(id)
      id = id[0].id;
      if (id) {
        this.cliService.getApiCliente(id).subscribe(
          cliente => {
            this.cita.cliente = cliente as Cliente;
            this.update(this.cita);
          }
        )
      }
    }
    if (this.clienteForm.valid) {
      this.cliente.nombre = this.clienteForm.get('nombre').value;
      this.cliente.apellido = this.clienteForm.get('apellido').value;
      this.cliente.correo = this.clienteForm.get('correo').value;
      this.cliente.fechaNacimiento = this.clienteForm.get('fechaNacimiento').value;
      this.cliente.telefono = this.clienteForm.get('telefono').value;

      this.cliente.identificacion = this.clienteForm.get('identificacion').value;
      this.cliService.create(this.cliente).subscribe(
        cliente => {
          this.cita.cliente = cliente;
          this.update(this.cita);
        },
        err => {
          this.errores = err.errors as string[];
          swal.fire('Error', `No se pudo completar la solicitud`, 'warning');
        });
    }
  }

  update(cita: Cita) {
    this.citaService.update(cita).subscribe(
      cita => {
        this.router.navigate(['/citas']);
        swal.fire('Registro Actualizado', `La cita: ${cita.cliente.nombre} ha sido actualizado con exito`, 'success');
      }
    );
  }

  cargarServicios() {
    this.serv.cargarServiciosByEnabled().
      subscribe(
        response => {
          this.servicios = response as Servicio[];

        }
      );
  }

  cargarClientes() {
    this.cliService.getAllClientes().
      subscribe(
        response => {
          this.clientes = response as Cliente[];
        }
      )
  }

  cargarMetodos() {
    this.metService.cargarServiciosByEnabled().
      subscribe(
        response => {
          this.metodos = response as MetodoPago[];
        }
      )
  }

  onItemSelect(item: any) {

    this.clienteSelectForm.controls['cliente'].setValue(item.nameFull);
  }

  goNext(progress: ProgresoComponent) {
    progress.next();
  }

  onStateChange(event) {
    console.log(event);
  }

  ngAfterViewInit() { }

  get medicoForm() {
    return this.infoForm.get('medico');
  }

  cambioCliente(event) {
    var target = event.target;
    if (target.checked) {
      this.cliente = new Cliente();
      this.clienteSelectForm.reset();
    }

  }



  cargaInformacionForm() {
    this.cita.fechaCita = this.fechaForm.get('fecha').value;
    this.cita.horaInicio = this.horasForm.get('horaInicio').value;;
    this.cita.horaFin = this.horasForm.get('horaFin').value;
    this.cita.medico = this.infoForm.get('medico').value;
    this.cita.servicio = this.infoForm.get('servicio').value;
    this.cita.metodoPago = this.infoForm.get('metodo').value;
    this.cita.usuario = this.auth.getUsuario();
  }

  realizaCita() {
    this.cargaInformacionForm();
    if (this.clienteSelectForm.valid) {
      var id = this.clienteSelectForm.get('cliente').value;
      console.log(id)
      id = id[0].id;
      if (id) {
        this.cliService.getApiCliente(id).subscribe(
          cliente => {
            this.cita.cliente = cliente as Cliente;
            this.realizarCita(this.cita);
          }
        )
      }
    }
    if (this.clienteForm.valid) {
      this.cliente.nombre = this.clienteForm.get('nombre').value;
      this.cliente.apellido = this.clienteForm.get('apellido').value;
      this.cliente.correo = this.clienteForm.get('correo').value;
      this.cliente.fechaNacimiento = this.clienteForm.get('fechaNacimiento').value;
      this.cliente.telefono = this.clienteForm.get('telefono').value;
      if ((this.clienteForm.get('identificacion').value as string)?.trim() !== '') {
        this.cliente.identificacion = this.clienteForm.get('identificacion').value;
      }
      this.cliService.create(this.cliente).subscribe(
        cliente => {
          this.cita.cliente = cliente;
          this.realizarCita(this.cita);
        },
        err => {
          this.errores = err.errors as string[];
          swal.fire('Error', `No se pudo completar la solicitud`, 'warning');
        });
    }
  }

  realizarCita(cita: Cita) {
    this.citaService.create(cita).subscribe(
      cita => {
        this.router.navigate(['/citas']);
        swal.fire('Nuevo Registro', `La cita para: ${cita.cliente.nombre} ha sido creado con exito`, 'success');
      },
      err => {
        this.errores = err.errors as string[];
        swal.fire('Error', `No se pudo completar la solicitud`, 'warning');
      }
    );
  }

  compararMedico(o1: Medico, o2: Medico): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

  compararServicio(o1: Servicio, o2: Servicio): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

  compararMetodo(o1: MetodoPago, o2: MetodoPago): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

}

function fechaRango(control: AbstractControl): { [key: string]: any } | null {
  const fecha: any = control.value;
  const fechaHoy = new Date();
  if (new Date(fecha).setHours(0, 0, 0, 0) < fechaHoy.setHours(0, 0, 0, 0)) {
    return { 'fecha': 'Fecha no valida para realizar cita' };
  } else {
    return null;
  }
}

function horarios(form: UntypedFormGroup): { [key: string]: any } | null {
  var horaInicio = form.controls['horaInicio'].value;
  var horaFin = form.controls['horaFin'].value;
  if (horaInicio && horaFin) {
    var timeArr = horaInicio.split(':');
    const fecha1 = new Date().setHours(timeArr[0], timeArr[1], 0)
    var timeArr2 = horaFin.split(':');
    const fecha2 = new Date().setHours(timeArr2[0], timeArr2[1], 0)
    if (fecha1 >= fecha2) {
      // horaFin.setErrors({ 'horaFin': 'hora inicio menor a hora fin' });
      return { 'horas': 'Hora fin es menor a Horario de inicio' };
    }
    return null;
  }
  return { 'horas': 'seleccionar horas' };
}