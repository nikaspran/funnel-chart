import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {FunnelStep} from "../funnel.model";

@Component({
  selector: 'fc-funnel-editor-step',
  templateUrl: './funnel-editor-step.component.html',
  styleUrls: ['./funnel-editor-step.component.scss'],
  inputs: ['step']
})
export class FunnelEditorStepComponent implements OnInit {
  step: FunnelStep;

  constructor() {
  }

  ngOnInit() {
  }
}
