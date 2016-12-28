import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {MaterialModule} from '@angular/material';

import {AppComponent} from './app.component';

import {CoreModule} from './core/core.module';
import {FunnelModule} from "./funnel/funnel.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MaterialModule.forRoot(),
    CoreModule,
    FunnelModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
