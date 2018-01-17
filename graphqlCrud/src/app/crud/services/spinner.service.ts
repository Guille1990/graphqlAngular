import { Injectable } from '@angular/core';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { MatDialog, MatDialogRef } from '@angular/material';

@Injectable()
export class SpinnerService {

  private dialogRef: MatDialogRef<SpinnerComponent>;

  constructor(
    public dialog: MatDialog
  ) { }

  openSpinner () {
    return this.dialogRef = this.dialog.open(SpinnerComponent, {
      width: '250px',
      panelClass: 'dialogPanel'
    });
  }

  closeSpinner () {
    return this.dialogRef.close();
  }
}
