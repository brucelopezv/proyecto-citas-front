import { Usuario } from "src/app/usuarios/usuario";
import { Cliente } from "../../cliente/cliente";
import { Medico } from "../../medico/medico";
import { MetodoPago } from "../../metodo-pago/metodo-pago";
import { Servicio } from "../../servicio/servicio";
import { Estado } from "./estado";

export class Cita {

    id: number;
    medico: Medico;
    servicio: Servicio;
    fechaCita: Date;
    cliente: Cliente;
    horaInicio: string;
    horaFin: string;
    usuario: Usuario;
    metodoPago: MetodoPago;
    estado: Estado;
    precio: number;

}
