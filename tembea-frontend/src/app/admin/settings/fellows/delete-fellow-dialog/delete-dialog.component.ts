import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FellowsService } from '../../../__services__/fellows.service';
import { AlertService } from 'src/app/shared/alert.service';
import { ISuccessResponse } from 'src/app/shared/models/success-response.model';

@Component({
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteFellowModalComponent {
  @Output() removeUser = new EventEmitter();
  public fellow = this.data.fellow;

  constructor(
    public fellowsService: FellowsService,
    public alertService: AlertService,
    public dialogRef: MatDialogRef<DeleteFellowModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteFellow(): void {
    this.fellowsService.removeFellowFromRoute(this.fellow.id).subscribe((data: ISuccessResponse) => {
      this.alertService.success(data.message);
      this.removeUser.emit();
    }, () => {
      this.alertService.error(
        'Something went terribly wrong, we couldn\`t remove the fellow. Please try again.'
      );
    });
    this.dialogRef.close();
  }
}
