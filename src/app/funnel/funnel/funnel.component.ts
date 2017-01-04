import {
  Component, OnInit, ViewChild, ElementRef, SimpleChanges, KeyValueDiffer
} from '@angular/core';
import {CanvasService, Shape, EquilateralTrapezoid, RenderContext, Label} from "../canvas.service";
import {Funnel} from "../funnel.model";

@Component({
  selector: 'fc-funnel',
  templateUrl: './funnel.component.html',
  styleUrls: ['./funnel.component.scss'],
  inputs: ['funnel'],
  providers: [CanvasService]
})
export class FunnelComponent implements OnInit {
  @ViewChild('renderTarget') renderTarget: ElementRef;
  funnel: Funnel;
  context: RenderContext;
  private differ: KeyValueDiffer;

  constructor(private canvasService: CanvasService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initialiseContext();
  }

  ngDoCheck(): void {
    if (this.context) {
      this.render();
    }
  }

  toShapes(): Shape<any>[] {
    const {steps} = this.funnel;
    const startValue = 1.2 * steps[0].value;
    const maxValue = Math.max(startValue, ...steps.map(step => step.value));
    const toProportional = value => value / maxValue * this.context.width();
    const result = [];
    const height = this.context.height() / steps.length;

    for (let i = 0; i < steps.length; i++) {
      const current = steps[i];
      const previous = steps[i - 1];

      const previousEnd = (previous && previous.value) || startValue;

      // TODO: handle mixed percentages
      const widthTop = toProportional(previousEnd);
      const widthBottom = toProportional(current.value);

      if (Number.isNaN(widthBottom) || Number.isNaN(widthTop)) {
        continue;
      }

      const centerY = height * i + height / 2;

      result.push(new EquilateralTrapezoid({
        id: current.id,
        centerX: this.context.width() / 2,
        centerY,
        fill: current.background,
        stroke: current.border,
        height,
        widthTop,
        widthBottom
      }));

      if (current.name) {
        result.push(new Label({
          id: `${current.id}_title`,
          fill: 'black',
          stroke: 'none',
          text: current.name,
          fontSize: 36,
          centerX: this.context.width() / 2,
          centerY
        }));
      }
    }
    return result;
  }

  private initialiseContext() {
    this.context = this.canvasService.createContext(this.renderTarget);
  }

  private render() {
    const shapes = this.toShapes();
    this.context.render(shapes);
  }
}
