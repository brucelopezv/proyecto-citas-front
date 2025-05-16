import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CatalogosComponent } from './admin/catalogos.component';
import { EspecialidadComponent } from './admin/especialidad/especialidad.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { FormComponent } from './admin/especialidad/form.component';
import { PaginadorComponent } from './paginador/paginador.component';
import { MedicoComponent } from './admin/medico/medico.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormmedicoComponent } from './admin/medico/formmedico.component';
import { ServicioComponent } from './admin/servicio/servicio.component';
import { FormServicioComponent } from './admin/servicio/form-servicio.component';
import { MetodoPagoComponent } from './admin/metodo-pago/metodo-pago.component';
import { FormMetodoComponent } from './admin/metodo-pago/form-metodo.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CitaComponent } from './admin/cita/cita.component';
import { registerLocaleData } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import localeES from '@angular/common/locales/es-GT';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { AgendaCitaComponent } from './admin/cita/agenda-cita/agenda-cita.component';
import { CitaFormComponent } from './admin/cita/agenda-cita/cita-form.component';
import { ClienteComponent } from './admin/cliente/cliente.component';
import { ClienteFormComponent } from './admin/cliente/cliente-form.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectSearchModule } from 'mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProgresoComponent } from './progreso/progreso.component';
import { ProgresoPasoComponent } from './progreso/progreso-paso/progreso-paso.component';
import { ProgresoPasoDirective } from './progreso/progreso-paso.directive';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DetalleComponent } from './admin/cliente/detalle/detalle.component';
import { ReporteComponent } from './admin/reporte/reporte.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FilterPipe } from './Pipes/filter.pipe';


registerLocaleData(localeES, 'es');

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'especialidades', component: EspecialidadComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'catalogos', component: CatalogosComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'especialidades/form', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'especialidades/form/:id', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'especialidades/page/:page', component: EspecialidadComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'medicos', component: MedicoComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'medicos/form', component: FormmedicoComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'medicos/form/:id', component: FormmedicoComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'servicios', component: ServicioComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'servicios/form', component: FormServicioComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'servicios/form/:id', component: FormServicioComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'metodos', component: MetodoPagoComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'metodos/form', component: FormMetodoComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'metodos/form/:id', component: FormMetodoComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'citas', component: CitaComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'citas/form', component: CitaFormComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'citas/form/:id', component: CitaFormComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'clientes', component: ClienteComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'clientes/form', component: ClienteFormComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'clientes/form/:id', component: ClienteFormComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
  { path: 'reportes', component: ReporteComponent, canActivate: [AuthGuard, RoleGuard], data: { role: ['ROLE_ADMIN'] } },
]

export const DD_MM_YYYY_Format = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UsuariosComponent,
    InicioComponent,
    FooterComponent,
    CatalogosComponent,
    EspecialidadComponent,
    FormComponent,
    PaginadorComponent,
    MedicoComponent,
    FormmedicoComponent,
    ServicioComponent,
    FormServicioComponent,
    MetodoPagoComponent,
    FormMetodoComponent,
    CitaComponent,
    AgendaCitaComponent,
    CitaFormComponent,
    ClienteComponent,
    ClienteFormComponent,
    ProgresoComponent,
    ProgresoPasoComponent,
    ProgresoPasoDirective,
    DetalleComponent,
    ReporteComponent,
    FilterPipe,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgbModalModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatMomentDateModule,
    MatSelectSearchModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    [NgxMatTimepickerModule],
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgxChartsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es' },
    MatDatepickerModule,
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_Format },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
