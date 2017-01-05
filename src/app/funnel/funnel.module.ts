import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FunnelComponent} from './funnel/funnel.component';
import {FunnelEditorComponent} from "./funnel-editor/funnel-editor.component";
import {FormsModule} from "@angular/forms";
import {MaterialModule} from "@angular/material";
import {FunnelEditorStepComponent} from './funnel-editor-step/funnel-editor-step.component';
import {DragulaModule} from "ng2-dragula";
import {ColorPickerModule} from "angular2-color-picker";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DragulaModule,
    MaterialModule,
    ColorPickerModule
  ],
  exports: [FunnelComponent, FunnelEditorComponent],
  declarations: [FunnelComponent, FunnelEditorComponent, FunnelEditorStepComponent]
})
export class FunnelModule {
}
