import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ProviderModalComponent } from '../provider-modal/provider-modal.component';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { ProviderService} from '../../__services__/providers.service';
import { AlertService} from '../../../shared/alert.service';
import { AppEventService } from '../../../shared/app-events.service';
import SubscriptionHelper from '../../../utils/unsubscriptionHelper';

@Component({
  selector: 'app-provider-card',
  templateUrl: './provider-card.component.html',
  styleUrls: ['../../cabs/cab-inventory/cab-card/cab-card.component.scss']
})
export class ProviderCardComponent implements OnInit, OnDestroy {
  @Output() showOptions: EventEmitter<any> = new EventEmitter();
  @Input() username: string;
  @Input() providerName: string;
  @Input() email: string;
  @Input() showMoreIcon: boolean;
  @Input() hidden: boolean;
  @Input() providerId: number;
  confirmDeleteSubscription: any;
  closeDialogSubscription: any;

  constructor(
    public dialog: MatDialog,
    public providerService: ProviderService,
    public alert: AlertService,
    public appEventService: AppEventService ) { }

  ngOnInit() { }

  openEditModal() {
    const dialogRef = this.dialog.open(ProviderModalComponent, {
      width: '620px', panelClass: 'small-modal-panel-class',
      data: { name: this.providerName, email: this.email, id: this.providerId } });
    dialogRef.afterClosed().subscribe(() => {
      this.hidden = !this.hidden;
    }); }

  deleteProvider(id: number) {
    this.providerService.deleteProvider(id).subscribe(res => {
      if (res.success) {
        this.appEventService.broadcast({ name: 'providerDeletedEvent'});
        this.alert.success(res.message);
      }
    }, error => {
      this.alert.error(error.error.message);
    });
  }

  showDeleteModal() {
    this.dialog.open(ConfirmModalComponent, {
      data: { displayText: `delete provider ${this.providerName}  `, confirmText: 'Yes'}
    });
    this.confirmDeleteSubscription =  this.appEventService.subscribe('confirmProviderDelete', () => {
      return this.deleteProvider(this.providerId);
    });
    this.closeDialogSubscription = this.appEventService.subscribe('closeConfirmationDialog', () => {
      return this.hidden = !this.hidden;
    });
  }
  showMoreOptions() {
    this.hidden = !this.hidden;
    this.showOptions.emit();
  }
  ngOnDestroy(): void {
    SubscriptionHelper.unsubscribeHelper([this.closeDialogSubscription, this.confirmDeleteSubscription]);
  }
}
