import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DriversInventoryService } from 'src/app/admin/__services__/drivers-inventory.service';
import { AlertService } from 'src/app/shared/alert.service';
import { IDeleteCabInventory } from 'src/app/shared/models/cab-inventory.model';
import { AppEventService } from 'src/app/shared/app-events.service';

@Component({
  templateUrl: './delete-driver-dialog.component.html',
  styleUrls: ['./delete-driver-dialog.component.scss']
})
export class DeleteDriverDialogComponent {

  @Output() refresh = new EventEmitter();
  public driver = this.data.driver;

  constructor(
    public driverService: DriversInventoryService,
    public dialog: MatDialogRef<DeleteDriverDialogComponent>,
    public alert: AlertService,
    public appEventService: AppEventService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  closeDialog(): void {
    this.dialog.close();
    this.refresh.emit();
  }

  delete() {
    const { id: driverId, providerId} = this.driver;
    this.driverService.deleteDriver(providerId, driverId).subscribe((response: IDeleteCabInventory) => {
      const { success, message } = response;
      if (success) {
        this.alert.success(message);
        this.appEventService.broadcast({ name: 'driverDeletedEvent'});
      } else {
        this.alert.error(message);
      }
    });
    this.closeDialog();
  }

}
