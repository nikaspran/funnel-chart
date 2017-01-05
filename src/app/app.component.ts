import {Component} from '@angular/core';
import {Funnel, FunnelStep} from "./funnel/funnel.model";
import {ColorsService, THEMES, Color} from "./funnel/colors.service";

function oneOf(items) {
  return items[Math.floor(Math.random() * items.length)];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ColorsService]
})
export class AppComponent {
  funnel: Funnel;
  theme: string;

  constructor(private colors: ColorsService) {
    this.theme = oneOf(THEMES);

    this.funnel = {
      startValue: 250,
      steps: this.generateSteps([
        {name: 'Impressions', value: 200},
        {name: 'Clicks', value: 100},
        {name: 'Downloads', value: 60},
        {name: 'Purchases', value: 40},
        {name: 'Repeat', value: 10}
      ])
    };
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
