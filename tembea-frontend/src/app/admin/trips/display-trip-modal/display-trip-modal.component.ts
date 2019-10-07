import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-display-trip',
  templateUrl: './display-trip-modal.component.html',
  styleUrls: ['./display-trip-modal.component.scss']
})
export class DisplayTripModalComponent {
  public tripInfo = this.tripData.tripInfo;
  public closeText = this.tripData.closeText;

  constructor(
    public dialogRef: MatDialogRef<DisplayTripModalComponent>,
    @Inject(MAT_DIALOG_DATA) public tripData: any
  ) { }
}
