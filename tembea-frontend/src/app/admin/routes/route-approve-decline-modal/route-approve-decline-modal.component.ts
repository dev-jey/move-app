import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import { IRouteApprovalDeclineInfo, IRouteDetails } from '../../../shared/models/route-approve-decline-info.model';
import { RouteRequestService } from '../../__services__/route-request.service';
import { AppEventService } from '../../../shared/app-events.service';

@Component({
  templateUrl: 'route-approve-decline-modal.component.html',
  styleUrls: ['route-approve-decline-modal.component.scss']
})

export class RouteApproveDeclineModalComponent implements OnInit {
  public values: any;
  public comment: string;
  public routeName: string;
  public takeOff: string;
  public providerName: string;
  public loading: boolean;
  public disableOtherInput = false;
  public selectedProviderOption: any;
  public selectedProvider: any;
  auto = null;
  @ViewChild('approveForm') approveForm: NgForm;

  constructor(
    public dialogRef: MatDialogRef<RouteApproveDeclineModalComponent>,
    public authService: AuthService,
    private routeService: RouteRequestService,
    private appEventService: AppEventService,
    @Inject(MAT_DIALOG_DATA) public data: IRouteApprovalDeclineInfo,
  ) {

  }

  ngOnInit() {
    this.loading = false;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  approve(values): void {
    this.setLoading(true);
    const { routeName, takeOff, comment } = values;
    const routeDetails: IRouteDetails = { routeName, takeOff };
    const { data: { routeRequestId } } = this;
    delete this.selectedProvider.user.slackId;
    this.handleAction(this.routeService.approveRouteRequest(routeRequestId, comment, routeDetails, this.selectedProvider));
  }

  decline(values): void {
    this.setLoading(true);
    const { data: { routeRequestId } } = this;
    const { comment } = values;
    this.handleAction(this.routeService.declineRequest(routeRequestId, comment));
  }

  handleAction(action: Observable<any>): void {
    action.subscribe(() => {
      this.closeDialog();
      this.appEventService.broadcast({ name: 'updateRouteRequestStatus' });
    }, () => this.setLoading(false));
  }

  setLoading(value: boolean): void {
    this.loading = value;
  }

  setAuto(event) {
    this.auto = event;
  }

  clearRouteFields(event) {
    const { value } = event.target;
    if (value === '') {
      this.disableOtherInput = false;
      this.approveForm.form.patchValue(this.selectedProviderOption);
    }
  }

  clickedRouteProviders (event) {
    this.selectedProvider = event;
    this.disableOtherInput = true;
    this.approveForm.form.patchValue(event);
  }
}
