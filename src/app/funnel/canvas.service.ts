import {Injectable, ElementRef} from "@angular/core";
import * as kute from 'kute.js';
import 'kute.js/kute-svg';

export interface ShapeProperties {
  id: string;
  fill: string;
  stroke: string;
  _tween?;
}

export interface Shape<PropType extends ShapeProperties> {
  props: PropType;
}

export interface EquilateralTrapezoidProperties extends ShapeProperties {
  centerX: number;
  centerY: number;
  widthTop: number;
  widthBottom: number;
  height: number;
}

export class EquilateralTrapezoid implements Shape<EquilateralTrapezoidProperties> {
  constructor(public props: EquilateralTrapezoidProperties) {
  }
}

export abstract class RenderContext {
  abstract render(shapes: Shape<any>[]);

  abstract width(): number;

  abstract height(): number;
}

class CanvasRenderContext extends RenderContext {
  constructor(private ctx: CanvasRenderingContext2D) {
    super();
  }

  render(shapes: Shape<any>[]) {
    shapes.forEach(this.renderShape.bind(this));
  }

  private renderShape(shape: Shape<any>) {
    if (shape instanceof EquilateralTrapezoid) {
      const {props} = shape;

      const halfTop = props.widthTop / 2;
      const halfBottom = props.widthBottom / 2;
      const halfHeight = props.height / 2;

      const topLeft = [props.centerX - halfTop, props.centerY - halfHeight];
      const topRight = [props.centerX + halfTop, props.centerY - halfHeight];
      const bottomRight = [props.centerX + halfBottom, props.centerY + halfHeight];
      const bottomLeft = [props.centerX - halfBottom, props.centerY + halfHeight];

      this.ctx.beginPath();
      this.ctx.fillStyle = props.fill;
      this.moveTo(topLeft);
      this.lineTo(topRight);
      this.lineTo(bottomRight);
      this.lineTo(bottomLeft);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  private moveTo(point: number[]) {
    this.ctx.moveTo(point[0], point[1]);
  }

  private lineTo(point: number[]) {
    this.ctx.lineTo(point[0], point[1]);
  }

  width(): number {
    return this.ctx.canvas.clientWidth;
  }

  height(): number {
    return this.ctx.canvas.clientHeight;
  }
}

function equal(first, second) {
  for (let aProperty in first) {
    if (first.hasOwnProperty(aProperty) && first[aProperty] !== second[aProperty]) {
      return false;
    }
  }

  return Object.keys(first).length === Object.keys(second).length;
}

class SvgRenderContext extends RenderContext {
  private previousProps = {};

  constructor(private element: HTMLElement) {
    super();

    this.element.setAttribute('viewBox', '0 0 1000 1000');
  }

  render(shapes: Shape<any>[]) {
    shapes.forEach(this.renderShape.bind(this));
  }

  private renderShape(shape: Shape<any>) {
    const existingElement = this.element.querySelector(`#${shape.props.id}`);

    const previousProps = this.previousProps[shape.props.id];
    if (previousProps && equal(previousProps, shape.props)) {
      return;
    }

    this.previousProps[shape.props.id] = Object.assign({}, shape.props);
    if (shape instanceof EquilateralTrapezoid) {
      this.renderEquilateralTrapezoid(existingElement, shape.props);
    }
  }

  private renderEquilateralTrapezoid(existingElement: Element, props: EquilateralTrapezoidProperties) {
    const halfTop = props.widthTop / 2;
    const halfBottom = props.widthBottom / 2;
    const halfHeight = props.height / 2;

    const topLeft = [props.centerX - halfTop, props.centerY - halfHeight];
    const topRight = [props.centerX + halfTop, props.centerY - halfHeight];
    const bottomRight = [props.centerX + halfBottom, props.centerY + halfHeight];
    const bottomLeft = [props.centerX - halfBottom, props.centerY + halfHeight];

    const path = [
      this.moveTo(topLeft),
      this.lineTo(topRight),
      this.lineTo(bottomRight),
      this.lineTo(bottomLeft)
    ].join(' ');

    if (existingElement) {
      if (props._tween) {
        props._tween.stop();
      }

      props._tween = kute.to(existingElement, {
        path,
        complete() {
          delete props._tween;
        }
      }).start();
      return;
    }

    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.id = props.id;
    pathElement.setAttribute('fill', props.fill);
    pathElement.setAttribute('d', path);
    this.element.appendChild(pathElement);
  }

  private moveTo(point: number[]) {
    return `M${point[0]},${point[1]}`;
  }

  private lineTo(point: number[]) {
    return `L${point[0]},${point[1]}`;
  }

  width(): number {
    return 1000;
  }

  height(): number {
    return 1000;
  }

}

@Injectable()
export class CanvasService {
  createContext(element: ElementRef): RenderContext {
    const nativeElement = element.nativeElement;
    switch (nativeElement.nodeName.toUpperCase()) {
      case 'CANVAS':
        const ctx = (nativeElement as HTMLCanvasElement).getContext('2d');
        return new CanvasRenderContext(ctx);
      case 'SVG':
        return new SvgRenderContext(nativeElement);
      default:
        throw new Error(`Unknown parent element type: ${nativeElement.nodeName}`);
    }
  }
}
