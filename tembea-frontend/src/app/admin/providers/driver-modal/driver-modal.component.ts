import {Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NgForm } from '@angular/forms';
import { ProviderService} from '../../__services__/providers.service';
import { AlertService } from '../../../shared/alert.service';
import {AppEventService} from '../../../shared/app-events.service';

@Component({
  selector: 'app-driver-modal',
  templateUrl: './driver-modal.component.html',
  styleUrls: ['./driver-modal.component.scss', '../../cabs/add-cab-modal/add-cab-modal.component.scss']
})
export class DriverModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DriverModalComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: any,
    private appEventService: AppEventService,
    public providerService: ProviderService,
    public toastService: AlertService,
  ) {}
  loading = false;

  static createDriverObject(data) {
    let createObject: any = {};
    const { email, driverName, driverPhoneNo, driverNumber } = data.value;
    if (!email) {
      createObject.driverName = driverName;
      createObject.driverPhoneNo = driverPhoneNo;
      createObject.driverNumber = driverNumber;
      return createObject;
    }
    createObject = data.value;
    return  createObject;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  addDriver(form: NgForm): void {
    const driverObject = DriverModalComponent.createDriverObject(form);
    driverObject.providerId = this.data.providerId;
    this.loading = true;
    this.providerService.addDriver(driverObject).subscribe(res => {
      if (res.success) {
        this.appEventService.broadcast({ name: 'newDriver' });
        this.toastService.success(res.message);
        this.closeDialog();
      }
    }, error => {
      this.loading = false;
      this.toastService.error(error.error.message);
    });
  }

}
