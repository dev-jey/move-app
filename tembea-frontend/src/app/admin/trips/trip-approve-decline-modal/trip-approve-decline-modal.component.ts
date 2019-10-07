import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NgForm} from '@angular/forms';
import {AuthService} from 'src/app/auth/__services__/auth.service';
import {TripRequestService} from '../../__services__/trip-request.service';
import {AppEventService} from 'src/app/shared/app-events.service';


@Component({
  templateUrl: 'trip-approve-decline-modal.component.html',
  styleUrls: ['trip-approve-decline-modal.component.scss']
})

export class TripApproveDeclineModalComponent implements OnInit {
  public values: any;
  public loading: boolean;
  public comment: string;
  private account: any;
  public cols = 3;
  public rowHeight: any = '3:1';
  public disableOtherInput = false;
  public providerName: string;

  public selectedCabOption = {driverName: '', driverPhoneNo: '', regNumber: ''};
  auto = null;
  @ViewChild('approveForm') approveForm: NgForm;
  selectedProviderId: any;

  constructor(
    public dialogRef: MatDialogRef<TripApproveDeclineModalComponent>,
    public authService: AuthService,
    private tripRequestService: TripRequestService,
    private appEventService: AppEventService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {

  }

  ngOnInit(): void {
    this.loading = false;
    this.account = this.authService.getCurrentUser();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  confirm(values) {
    values.selectedProviderId = this.selectedProviderId;
    this.loading = true;
    const {tripId} = this.data;
    this.tripRequestService.confirmRequest(tripId, values)
      .subscribe(() => {
        this.closeDialog();
        this.appEventService.broadcast({name: 'reInitializeTripRequest'});
      });
  }

  decline(values) {
    this.loading = true;
    const {tripId} = this.data;
    const {comment} = values;
    this.tripRequestService.declineRequest(tripId, comment)
      .subscribe(() => {
        this.closeDialog();
        this.appEventService.broadcast({name: 'reInitializeTripRequest'});
      });
  }

  setAuto(event) {
    this.auto = event;
  }

  clearFields(event) {
    const {value} = event.target;
    if (value === '') {
      this.disableOtherInput = false;
      this.approveForm.form.patchValue(this.selectedCabOption);
    }
  }

  clickedProviders(event) {
    this.selectedProviderId = event.providerUserId;
    this.disableOtherInput = true;
    this.approveForm.form.patchValue(event);
  }
}
