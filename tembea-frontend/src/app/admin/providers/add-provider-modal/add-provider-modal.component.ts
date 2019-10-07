import { Component, Output, EventEmitter, } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ProviderModel } from 'src/app/shared/models/provider.model';
import { ProviderService } from 'src/app/admin/__services__/providers.service';
import { AlertService } from 'src/app/shared/alert.service';
import { AppEventService } from 'src/app/shared/app-events.service';

@Component({
  templateUrl: './add-provider-modal.component.html',
  styleUrls: ['./../../../admin/cabs/add-cab-modal/add-cab-modal.component.scss'
  ]
})

export class AddProviderModalComponent {
  providerData: ProviderModel;
  loading: boolean;

  @Output() executeFunction = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<AddProviderModalComponent>,
    public providerService: ProviderService,
    public alert: AlertService,
    private appEventService: AppEventService
  ) {
    this.providerData = new ProviderModel('', '');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  logError(error) {
    if (error && error.status === 404) {
      this.alert.error('Provider user email entered does not exist');
    } else if (error && error.status === 409) {
      const { error: { message } } = error;
      this.alert.error(message);
    } else {
      this.alert.error('Something went wrong, please try again');
    }
  }

  addProvider(): void {
    this.loading = true;
    this.providerService.add(this.providerData)
      .subscribe(
        (responseData) => {
          if (responseData.success) {
            this.alert.success(responseData.message);
            this.appEventService.broadcast({ name: 'newProvider' });
            this.loading = false;
            this.dialogRef.close();
          }
        },
        (error) => {
          this.logError(error);
          this.loading = false;
        }
      );
  }
}
