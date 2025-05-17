import { Component, OnInit, Input } from '@angular/core';
import { Medico } from '../../medico/medico';
import { MedicoService } from '../../medico/medico.service';
import { ModalService } from './modal.service';

@Component({
    selector: 'agenda-cita',
    templateUrl: './agenda-cita.component.html',
    styleUrls: ['./agenda-cita.component.css'],
    standalone: false
})
export class AgendaCitaComponent implements OnInit {
  @Input() fechaCita: string;


  constructor(
    public modalService: ModalService,
  ) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.modalService.cerrarModal();
  }


}
