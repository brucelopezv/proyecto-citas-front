import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { ProgresoHelperService } from './progreso-helper.service';

@Directive({
    selector: '[appProgresoPaso], [progressStepNext], [progressStepPrev]',
    standalone: false
})
export class ProgresoPasoDirective implements OnInit {

  @Input('progressStepNext') next;
  @Input('progressStepPrev') prev;

  private methods = {
    prev: false,
    next: false,

  }

  @HostListener('click', ['$event']) listen(e) {
    this.progressHelper.eventHelper.next(this.methods);
  }

  constructor(
    private progressHelper: ProgresoHelperService,
    private el: ElementRef<HTMLButtonElement>
  ) { }

  ngOnInit(): void {
    this.initMethods();
  }



  private initMethods() {
    if ('next' in this) {
      this.methods = {
        ...this.methods,
        next: true
      }
    }
    if ('prev' in this) {
      this.methods = {
        ...this.methods,
        prev: true
      }
    }
  }

}
