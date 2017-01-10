import {Injectable, ElementRef} from "@angular/core";
import * as kute from 'kute.js';
import 'kute.js/kute-svg';

export interface ShapeProperties {
  id: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
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

export interface LabelProperties extends ShapeProperties {
  text: string;
  fontSize: number;
  centerX: number;
  centerY: number;
}

export class Label implements Shape<LabelProperties> {
  constructor(public props: LabelProperties) {
  }
}

export abstract class RenderContext {
  abstract render(shapes: Shape<any>[]);

  abstract width(): number;

  abstract height(): number;

  abstract exportBlob(format: string): Promise<Blob>;
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

  exportBlob(format: string): Promise<Blob> {
    return undefined;
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
    this.removeAllExcept(shapes);
  }

  private removeAllExcept(usedShapes: Shape<any>[]) {
    const isUsed = usedShapes
      .map(shape => shape.props.id)
      .reduce((used, id) => (used[id] = true) && used, {});

    for (let id in this.previousProps) {
      if (!isUsed[id]) {
        delete this.previousProps[id];
        this.element.removeChild(this.element.querySelector(`#${id}`));
      }
    }
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

    if (shape instanceof Label) {
      this.renderLabel(existingElement, shape.props);
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
      this.lineTo(bottomLeft),
      'z'
    ].join(' ');

    const setChangeableProperties = element => {
      element.setAttribute('fill', props.fill);
      element.setAttribute('stroke', props.stroke);
      element.setAttribute('stroke-width', props.strokeWidth);
    };

    if (existingElement) {
      setChangeableProperties(existingElement);

      const previousPath = existingElement.getAttribute('d');
      if (previousPath !== path) {
        this.animateTo(existingElement, props, {path});
      }

      return;
    }

    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    setChangeableProperties(pathElement);
    pathElement.id = props.id;
    pathElement.setAttribute('d', path);
    this.element.appendChild(pathElement);
  }

  private renderLabel(existingElement: Element, props: LabelProperties) {
    const setChangeableProperties = element => {
      element.innerHTML = props.text;
      element.setAttribute('fill', props.fill);
      element.setAttribute('font-size', `${props.fontSize}px`);
    };

    if (existingElement) {
      setChangeableProperties(existingElement);
      const originalY = parseInt(existingElement.getAttribute('y'), 10);
      return this.animateTo(existingElement, props, {
        svgTransform: {translate: [0, props.centerY - originalY]}
      });
    }

    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    setChangeableProperties(textElement);
    textElement.id = props.id;
    textElement.setAttribute('text-anchor', 'middle');
    textElement.setAttribute('x', String(props.centerX));
    textElement.setAttribute('y', String(props.centerY));
    this.element.appendChild(textElement);
  }

  private moveTo(point: number[]) {
    return `M${point[0]},${point[1]}`;
  }

  private lineTo(point: number[]) {
    return `L${point[0]},${point[1]}`;
  }

  private animateTo(element: Element, props: ShapeProperties, animateToProps) {
    return new Promise(resolve => {
      const tween = kute.to(element, Object.assign({}, animateToProps, {
        complete() {
          delete props._tween;
          resolve();
        }
      }));

      if (props._tween) {
        props._tween.chain(tween);
      } else {
        props._tween = tween;
        props._tween.start();
      }
    });
  }

  width(): number {
    return 1000;
  }

  height(): number {
    return 1000;
  }

  exportBlob(format: string): Promise<Blob> {
    switch (format) {
      case 'svg':
        return Promise.resolve(this.toSvg());
      case 'png':
        return this.toPng();
      default:
        throw new Error(`Unknown RenderContext export format: ${format}`);
    }
  }

  private toSvg(): Blob {
    return new Blob([this.toString()], {type: 'image/svg+xml;charset=utf-8'});
  }

  private toPng(): Promise<Blob> {
    return new Promise(resolve => {
      const img = new Image();
      const dataUrl = URL.createObjectURL(this.toSvg());
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.width = canvas.width = 1024;
      img.height = canvas.height = 1024;

      img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(dataUrl);
        canvas.toBlob(resolve, 'image/png');
      };

      img.src = dataUrl;
    });
  }

  private toString(): string {
    const serializer = new XMLSerializer();

    return serializer.serializeToString(this.element)
      .replace(/_ng[-\w]+=?"?"?/, ''); // angular attributes
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
