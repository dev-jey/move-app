import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeleteFellowModalComponent } from 'src/app/admin/settings/fellows/delete-fellow-dialog/delete-dialog.component';

 @Component({
  selector: 'app-fellow-card',
  templateUrl: './fellow-card.component.html',
  styleUrls: ['./fellow-card.component.scss']
})
export class FellowCardComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  @Output() removeFellow = new EventEmitter();
  @Input() name: string;
  @Input() image: string;
  @Input() partner: string;
  @Input() tripsTaken: string;
  @Input() startDate: string;
  @Input() endDate: string;
  @Input() showRemoveIcon: boolean;
  @Input() showAddIcon: boolean;
  @Input() userId: number;

  ngOnInit() {}

  showFellowDeleteModal() {
    const dialofRef = this.dialog.open(DeleteFellowModalComponent, {
      data: {
        fellow: {
          name: this.name,
          image: this.image,
          partner: this.partner,
          tripsTaken: this.tripsTaken,
          startDate: this.startDate,
          endDate: this.endDate,
          id: this.userId
        }
      }
    });

    dialofRef.componentInstance.removeUser.subscribe(() => {
      this.removeFellow.emit();
    });
  }
}
