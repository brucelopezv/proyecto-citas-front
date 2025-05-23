import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-progreso-paso',
    templateUrl: './progreso-paso.component.html',
    styleUrls: ['./progreso-paso.component.css'],
    standalone: false
})
export class ProgresoPasoComponent implements OnInit {


  public stepIndex: number;

  @HostBinding('class.activeStep')
  public isActive = false;

  @Input() public set activeState(step) {
    this.isActive = step === this;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
