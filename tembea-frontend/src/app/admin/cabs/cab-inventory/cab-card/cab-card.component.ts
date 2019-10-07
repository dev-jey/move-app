import { createDialogOptions } from './../../../../utils/helpers';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddCabsModalComponent } from '../../add-cab-modal/add-cab-modal.component';
import { IDeleteCabInventory } from 'src/app/shared/models/cab-inventory.model';
import { CabsInventoryService } from 'src/app/admin/__services__/cabs-inventory.service';
import { AlertService } from 'src/app/shared/alert.service';
import { openDialog } from 'src/app/utils/generic-helpers';


@Component({
  selector: 'app-cab-card',
  templateUrl: './cab-card.component.html',
  styleUrls: ['./cab-card.component.scss']
})
export class CabCardComponent implements OnInit {

  constructor(public dialog: MatDialog,
    public cabService: CabsInventoryService,
    public alert: AlertService,
    ) { }

  @Output() refreshWindow = new EventEmitter();
  @Output() showOptions: EventEmitter<any> = new EventEmitter();
  @Input() id: number;
  @Input() model: string;
  @Input() regNumber: string;
  @Input() capacity: number;
  @Input() providerId: number;
  @Input() hidden: boolean;
  @Input() showMoreIcon: boolean;

  ngOnInit() {}

  delete(cabId: number) {
    this.cabService.delete(cabId).subscribe((response: IDeleteCabInventory) => {
      const { success, message } = response;
      if (success) {
        this.alert.success(message);
        this.refreshWindow.emit();
      } else {
        this.alert.error(message);
      }
    });
  }

  showCabDeleteModal(cabId: number) {
    const dialogReference = openDialog(this.dialog, 'delete this cab');
    dialogReference.componentInstance.executeFunction.subscribe(() => {
      this.delete(cabId);
    });
  }

  showCabEditModal() {
    const dialogRef = this.dialog.open(AddCabsModalComponent, createDialogOptions(
      {
        id: this.id,
        model: this.model,
        regNumber: this.regNumber,
        capacity: this.capacity,
        providerId: this.providerId,
      }, '620px', 'small-modal-panel-class'));
    dialogRef.afterClosed().subscribe(() => {
      this.hidden = !this.hidden;
    });
  }

  showMoreOptions() {
    this.showOptions.emit();
  }
}
