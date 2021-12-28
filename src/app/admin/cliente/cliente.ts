import { Cita } from "../cita/agenda-cita/cita";

export class Cliente {

    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    fechaNacimiento: Date;
    nameFull: string;
    telefono: number;
    identificacion: string;
    citas: Cita[];
}
