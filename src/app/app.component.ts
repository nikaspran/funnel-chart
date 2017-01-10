import {Component} from '@angular/core';
import {Funnel, FunnelStep} from './funnel/funnel.model';
import {ColorsService, THEMES, Color} from './funnel/colors.service';
import {CanvasService, RenderContext} from './funnel/canvas.service';
import {FunnelComponent} from './funnel/funnel/funnel.component';
import FileSaver from 'file-saver';
import {read} from "fs";

function oneOf(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const EXPORT_FORMATS = ['svg', 'png'];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ColorsService]
})
export class AppComponent {
  funnel: Funnel;
  theme: string;
  context: RenderContext;
  EXPORT_FORMATS = EXPORT_FORMATS;
  readyForDownload = {};

  constructor(private colors: ColorsService) {
    this.theme = oneOf(THEMES);

    this.funnel = {
      startValue: 250,
      steps: this.generateSteps([
        {name: 'Impressions', value: 200},
        {name: 'Clicks', value: 100},
        {name: 'Downloads', value: 60},
        {name: 'Purchases', value: 40}
      ])
    };
  }

  generateDownloads() {
    this.EXPORT_FORMATS.forEach(format => {
      delete this.readyForDownload[format];
      this.context.exportBlob(format).then(blob => this.readyForDownload[format] = blob);
    });
  }

  downloadAs(format: string) {
    const readyBlob = this.readyForDownload[format] as Blob;
    if (readyBlob) {
      FileSaver.saveAs(readyBlob, `funnel.${format}`);
    }
  }

  private generateSteps(steps: {name: string,  value: number}[]): FunnelStep[] {
    return steps.reduce((built, step, index) => {
      const previousBuilt = built[built.length - 1] as FunnelStep;
      const lighterThanPreviousBackground = previousBuilt && this.colors.lighterThan(previousBuilt.background);

      const background = lighterThanPreviousBackground || new Color({theme: this.theme, weight: '500'});

      built.push(<FunnelStep> {
        id: `funnel-1-step-${index}`,
        background,
        border: new Color('white'),
        borderWidth: 10,
        color: new Color({theme: 'md-grey', weight: '900'}),
        name: step.name,
        value: step.value
      });
      return built;
    }, []);
  }
}
