import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FunnelComponent} from './funnel/funnel.component';
import {FunnelEditorComponent} from "./funnel-editor/funnel-editor.component";
import {FormsModule} from "@angular/forms";
import {MaterialModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  exports: [FunnelComponent, FunnelEditorComponent],
  declarations: [FunnelComponent, FunnelEditorComponent]
})
export class FunnelModule {
}
