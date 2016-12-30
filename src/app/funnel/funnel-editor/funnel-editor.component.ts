import {Component, OnInit} from '@angular/core';
import {Funnel, FunnelStep} from "../funnel.model";
import {DragulaService} from "ng2-dragula";

@Component({
  selector: 'fc-funnel-editor',
  templateUrl: './funnel-editor.component.html',
  styleUrls: ['./funnel-editor.component.scss'],
  inputs: ['funnel'],
})
export class FunnelEditorComponent implements OnInit {
  funnel: Funnel;

  constructor(dragula: DragulaService) {
    dragula.setOptions('steps', {
      moves(el, container, handle) {
        return handle.classList.contains('funnel-editor_reorder-handle');
      }
    });
  }

  ngOnInit() {
  }

  addStep() {
    this.funnel.steps.push({
      id: this.generateUUID(),
      background: 'black', // TODO
      border: 'blue'
    });
  }

  removeStep(step: FunnelStep) {
    this.funnel.steps.splice(this.funnel.steps.indexOf(step), 1);
  }

  private generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
