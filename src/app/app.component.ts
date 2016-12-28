import {Component} from '@angular/core';
import {Funnel} from "./funnel/funnel.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  funnel: Funnel;

  constructor() {
    this.funnel = {
      startValue: 250,
      steps: [
        {id: 'funnel-1-step-1', background: 'red', border: 'red', name: 'Impressions', value: 200},
        {id: 'funnel-1-step-2', background: 'blue', border: 'red', name: 'Clicks', value: 100},
        {id: 'funnel-1-step-3', background: 'green', border: 'red', name: 'Downloads', value: 60},
        {id: 'funnel-1-step-4', background: 'yellow', border: 'red', name: 'Purchases', value: 40},
        {id: 'funnel-1-step-5', background: 'tomato', border: 'red', name: 'Repeat', value: 10}
      ]
    };
  }
}
