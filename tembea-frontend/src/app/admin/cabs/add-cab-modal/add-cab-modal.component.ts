import { Component, Output, EventEmitter, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CabModel } from 'src/app/shared/models/cab-inventory.model';
import { CabsInventoryService } from '../../__services__/cabs-inventory.service';
import { AlertService } from 'src/app/shared/alert.service';
import { AppEventService } from 'src/app/shared/app-events.service';


@Component({
  templateUrl: './add-cab-modal.component.html',
  styleUrls: ['./add-cab-modal.component.scss']
})

export class AddCabsModalComponent {
  loading: boolean;
  cabData: CabModel;
  providerId: number;
  modalHeader: string;

  @Output() executeFunction = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef <AddCabsModalComponent>,
    public cabService: CabsInventoryService,
    public alert: AlertService,
    private appEventService: AppEventService
  ) {
    this.cabData = this.data;
    this.modalHeader = this.cabData.id ? 'Edit' : 'Add a';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

 response(responseData, action = 'newCab'): void {
  if (responseData.success) {
    this.alert.success(responseData.message);
    this.appEventService.broadcast({ name: 'newCab' });
    this.loading = false;
    this.closeDialog();
  }
 }

  addCab(): void {
    if (this.cabData.id) {
      return this.editCab(this.cabData);
    }
    this.loading = true;
    this.cabData.providerId = this.data.providerId;
    this.cabService.add(this.cabData)
    .subscribe(
      (responseData) => this.response(responseData),
      (error) => {
        this.displayError(error);
      }
    );
  }
  editCab(cab: CabModel) {
    const { id, ...cabData } = cab;
    this.loading = true;
    this.cabService.update(cabData, id).subscribe(
      responseData => this.response(responseData, 'updateCab'),
      error => {
        this.displayError(error);
      }
    );
  }

  displayError(error: any) {
    const { status } = error ;
    this.loading = false;
    switch (status) {
      case 409:
        this.alert.error('A cab with the registration already exists');
        break;
      case 404:
        this.alert.error('A cab with the registration does not exist');
        break;
      default:
        this.alert.error(error.message);
    }
  }
}
