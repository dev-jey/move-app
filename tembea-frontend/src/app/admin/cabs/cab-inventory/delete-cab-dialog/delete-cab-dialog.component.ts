import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CabsInventoryService } from 'src/app/admin/__services__/cabs-inventory.service';
import { AlertService } from 'src/app/shared/alert.service';
import { IDeleteCabInventory } from 'src/app/shared/models/cab-inventory.model';

@Component({
  templateUrl: './delete-cab-dialog.component.html',
  styleUrls: ['./delete-cab-dialog.component.scss']
})
export class DeleteCabModalComponent {
  @Output() refresh = new EventEmitter();
  public cab = this.data.cab;

  constructor(
    public cabService: CabsInventoryService,
    public dialog: MatDialogRef<DeleteCabModalComponent>,
    public alert: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  closeDialog(): void {
    this.dialog.close();
    this.refresh.emit();
  }

  delete() {
    this.cabService.delete(this.cab.id).subscribe((response: IDeleteCabInventory) => {
      const { success, message } = response;
      if (success) {
        this.alert.success(message);
      } else {
        this.alert.error(message);
      }
    });
    this.closeDialog();
  }
}
