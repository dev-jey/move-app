import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DeleteDriverDialogComponent } from 'src/app/admin/drivers/delete-driver-dialog/delete-driver-dialog.component';
import { AlertService } from '../../../shared/alert.service';
import { AppEventService } from '../../../shared/app-events.service';
import { DriverEditModalComponent } from '../driver-edit-modal/driver-edit-modal.component';

@Component({
  selector: 'app-driver-card',
  templateUrl: './driver-card.component.html',
  styleUrls: ['../../cabs/cab-inventory/cab-card/cab-card.component.scss', './driver-card.component.scss']
})

export class DriverCardComponent implements OnInit {

  @Output() showOptions: EventEmitter<any> = new EventEmitter();
  @Output() refreshWindow = new EventEmitter();
  @Input() id: number;
  @Input() providerId: number;
  @Input() driverName: string;
  @Input() showMoreIcon: boolean;
  @Input() driverPhoneNo: string;
  @Input() driverEmail: string;
  @Input() driverProviderId: number;
  @Input() driverNumber: string;
  @Input() hidden: boolean;
  confirmDeleteSubscription: any;
  closeDialogSubscription: any;
  dialogRef: MatDialogRef<DeleteDriverDialogComponent>;
  editDialogRef: MatDialogRef<DriverEditModalComponent>;

  constructor(
    public dialog: MatDialog,
    public alert: AlertService,
    public appEventService: AppEventService) { }

  ngOnInit() { }


  openEditModal() {
    this.editDialogRef = this.dialog.open(DriverEditModalComponent, {
      width: '620px', panelClass: 'small-modal-panel-class',
      data: {
        name: this.driverName, email: this.driverEmail,
        driverNumber: this.driverNumber, driverPhoneNo: this.driverPhoneNo,
        id: this.id, providerId: this.providerId
      }
    });
    this.editDialogRef.afterClosed().subscribe(() => {
      this.refreshWindow.emit();
    });
  }

  showMoreOptions(): void {
    this.hidden = !this.hidden;
    this.showOptions.emit();
  }

  showDeleteModal(): void {
    this.dialogRef = this.dialog.open(DeleteDriverDialogComponent, {
      panelClass: 'delete-cab-modal',
      data: {
        driver: {
          id: this.id,
          name: this.driverName,
          email: this.driverEmail,
          phoneNo: this.driverPhoneNo,
          providerId: this.driverProviderId
        }
      }
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.refreshWindow.emit();
    });
  }

}
