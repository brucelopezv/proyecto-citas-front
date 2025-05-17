import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { ProgresoHelperService } from './progreso-helper.service';
import { ProgresoPasoComponent } from './progreso-paso/progreso-paso.component';

import { Status, UiHelper } from './uiHelper';
@Component({
    selector: 'app-progreso',
    templateUrl: './progreso.component.html',
    styleUrls: ['./progreso.component.css'],
    standalone: false
})
export class ProgresoComponent extends UiHelper
  implements OnInit, AfterContentInit {
  itemLength: number;

  @Input() public set selectedIndex(value) {
    this.activeIndex = value || 0;
  }

  @Output() public stateChange = new EventEmitter<{
    activeIndex: number;
    activeStep: ProgresoPasoComponent;
  }>();

  @ContentChildren(ProgresoPasoComponent) public steps: QueryList<
    ProgresoPasoComponent
  >;

  constructor(protected progressHelper: ProgresoHelperService) {
    super(progressHelper);
  }

  ngOnInit(): void {
    this.progressHelper.eventHelper.subscribe({
      next: ({ prev, next }) => {
        if (next) {
          this.next();
        }

        if (prev) {
          this.prev();
        }
      },
    });
  }

  ngAfterContentInit() {
    this.initProgress(this.progressSteps.length);
    this.setActiveActiveStep(this.activeIndex);
    this.initStepIndex();
  }

  public next() {
    this.increaseStep();
  }

  public prev() {
    this.decreaseStep();
  }

  private increaseStep() {
    if (
      this.activeIndex === this.itemLength - 1 &&
      this.itemProgressList[this.activeIndex].status !== Status.COMPLETED
    ) {
      this.completeLastStep();
    }

    if (this.activeIndex < this.itemLength - 1) {
      this.activeIndex++;
      this.switchStatusNext(this.activeIndex);
      this.setActiveActiveStep(this.activeIndex);      
    }
  }

  private decreaseStep() {
    if (
      this.activeIndex === this.itemLength - 1 &&
      this.itemProgressList[this.activeIndex].status === Status.COMPLETED
    ) {
      this.undoLastComplete();
    } else {
      if (this.activeIndex > 0) {
        this.activeIndex--;
        this.switchStatusPrev(this.activeIndex);
        this.setActiveActiveStep(this.activeIndex);        
      }
    }
  }

  private emitStateChange(): void {
    this.stateChange.emit({
      activeIndex: this.activeIndex,
      activeStep: this.activeStep,
    });
  }

  private setActiveActiveStep(index: number): void {
    if (this.stepsExists) {
      this.removeActiveStep();
      this.updateActiveStep(index);
    }
  }

  private updateActiveStep(index) {
    this.progressSteps[index].activeState = this.progressSteps[index];
  }

  private removeActiveStep() {
    this.progressSteps.map((step) => {
      if (step.isActive) {
        step.isActive = false;
      }
    });
  }

  private initStepIndex() {
    this.progressSteps.forEach((step, i) => (step.stepIndex = i));
  }

  public get activeStep(): ProgresoPasoComponent {
    return this.progressSteps[this.activeIndex];
  }

  private get stepsExists(): boolean {
    return this.progressSteps && Array.isArray(this.progressSteps);
  }

  private get progressSteps(): ProgresoPasoComponent[] {
    return this.steps.toArray();
  }

  protected generateProgressArray(length): any[] {
    return [...Array(length).keys()].map((key) => {
      return {
        stepIndex: key,
        status: key === this.activeIndex ? Status.IN_PROGRESS : Status.PENDING,
      };
    });
  }

  private initProgress(value): void {
    this.itemLength = value || 0;
    this.itemProgressList = this.generateProgressArray(this.itemLength);
  }

}
