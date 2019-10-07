import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {AppEventService} from '../../shared/app-events.service';

@Component({
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmModalComponent {
  @Output() executeFunction = new EventEmitter();
  public displayText = this.data.displayText;
  public confirmText = this.data.confirmText;

  constructor(
    public dialogRef: MatDialogRef<ConfirmModalComponent>,
    public appEventService: AppEventService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  closeDialog(): void {
    this.appEventService.broadcast({ name: 'closeConfirmationDialog'});
    this.dialogRef.close();
  }

  confirmDialog() {
    this.appEventService.broadcast({name: 'confirmProviderDelete'});
    this.executeFunction.emit();
  }
}
