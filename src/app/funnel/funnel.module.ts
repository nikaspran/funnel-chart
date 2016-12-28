import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FunnelComponent} from './funnel/funnel.component';
import {FunnelEditorComponent} from "./funnel-editor/funnel-editor.component";
import {FormsModule} from "@angular/forms";
import {MaterialModule} from "@angular/material";
import { FunnelEditorStepComponent } from './funnel-editor-step/funnel-editor-step.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  exports: [FunnelComponent, FunnelEditorComponent],
  declarations: [FunnelComponent, FunnelEditorComponent, FunnelEditorStepComponent]
})
export class FunnelModule {
}
