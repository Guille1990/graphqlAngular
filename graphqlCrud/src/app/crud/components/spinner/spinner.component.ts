import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {

  constructor(
    public dialogRef: MatDialogRef<SpinnerComponent>
  ) { }

  onNoClick (): void {
    this.dialogRef.close();
  }
}
