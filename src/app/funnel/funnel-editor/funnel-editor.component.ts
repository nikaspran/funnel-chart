import {Component, OnInit} from '@angular/core';
import {Funnel} from "../funnel.model";

@Component({
  selector: 'fc-funnel-editor',
  templateUrl: './funnel-editor.component.html',
  styleUrls: ['./funnel-editor.component.scss'],
  inputs: ['funnel'],
})
export class FunnelEditorComponent implements OnInit {
  funnel: Funnel;

  constructor() {
  }

  ngOnInit() {
    console.log(this.funnel);
  }

}
