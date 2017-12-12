import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRouterModule } from './app-router/app-router.module';
import { AppComponent } from './app.component';
import { MaterialExportModule } from './material-export/material-export.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRouterModule,
    MaterialExportModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
