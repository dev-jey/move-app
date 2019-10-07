import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgForm } from '@angular/forms';
import { DriversInventoryService } from '../../__services__/drivers-inventory.service';
import { AlertService } from '../../../shared/alert.service';
import { AppEventService } from '../../../shared/app-events.service';

@Component({
  selector: 'app-driver-edit-modal',
  templateUrl: './driver-edit-modal.component.html',
  styleUrls: ['./driver-edit-modal.component.scss',
    '../../../auth/login-redirect/login-redirect.component.scss',
    './../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss']
})
export class DriverEditModalComponent implements OnInit {

  loading = false;
  constructor(
    public toastService: AlertService,
    public appEventService: AppEventService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public driverService: DriversInventoryService,
    public dialogRef: MatDialogRef<DriverEditModalComponent>,
  ) { }

  ngOnInit() { }

  editDriver(form: NgForm, id: number, providerId: number) {
    const { name: driverName, email,
      driverNumber, driverPhoneNo } = form.value;
    this.loading = true;
    const driverDetails = {
      driverName, email, driverNumber, driverPhoneNo
    };
    this.driverService.updateDriver(driverDetails, id, providerId).subscribe(
      res => {
        this.loading = false;
        if (res.success) {
          const { message } = res;
          this.toastService.success(message);
          this.appEventService.broadcast({ name: 'updatedDriversEvent' });
          this.closeDialog();
        }
      }, error => {
        this.loading = false;
        this.toastService.error(error.error.message);
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
