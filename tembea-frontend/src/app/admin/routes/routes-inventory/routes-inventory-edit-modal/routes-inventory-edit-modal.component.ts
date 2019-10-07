import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IRouteInventory } from 'src/app/shared/models/route-inventory.model';
import { RoutesInventoryService } from 'src/app/admin/__services__/routes-inventory.service';
import { AppEventService } from 'src/app/shared/app-events.service';
import { AlertService } from 'src/app/shared/alert.service';

@Component({
  templateUrl: './routes-inventory-edit-modal.component.html',
  styleUrls: ['./routes-inventory-edit-modal.component.scss']
})
export class RoutesInventoryEditModalComponent implements OnInit {
  public loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<RoutesInventoryEditModalComponent>,
    public alert: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: IRouteInventory,
    public routeService: RoutesInventoryService,
    private appEventsService: AppEventService
  ) { }

  ngOnInit() {
    this.loading = false;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  editRoute(data): void {
    this.loading = true;
    const { id } = this.data;


    const routeDetails: IRouteInventory = {
      name: data.name,
      takeOff: data.takeOff,
      regNumber: data.regNumber,
      capacity: data.capacity,
      batch: data.batch,
      status: data.status
    };
    this.routeService.changeRouteStatus(id, routeDetails).subscribe((res) => {
      if (res.success) {
        this.alert.success(res.message);
        this.appEventsService.broadcast({name: 'updateRouteInventory'});
        this.dialogRef.close();
      }
    }, (err: any) => {
      this.alert.error('Something went wrong');
      this.dialogRef.close();
    });
  }
}



