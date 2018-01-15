import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatTableModule,
  MatPaginatorModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatCardModule
} from '@angular/material';

const MODULES = [
  MatToolbarModule,
  MatTableModule,
  MatPaginatorModule,
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatCardModule
];

@NgModule({
  imports: MODULES,
  exports: MODULES
})
export class MaterialExportModule { }
