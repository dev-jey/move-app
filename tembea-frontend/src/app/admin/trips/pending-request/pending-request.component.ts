import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';

import { TripRequestService } from '../../__services__/trip-request.service';
import { TripRequest } from '../../../shared/models/trip-request.model';
import { ITEMS_PER_PAGE } from '../../../app.constants';
import { TripApproveDeclineModalComponent } from '../trip-approve-decline-modal/trip-approve-decline-modal.component';
import { AppEventService } from 'src/app/shared/app-events.service';

@Component({
  selector: 'app-pending-request',
  templateUrl: './pending-request.component.html',
  styleUrls: ['./pending-request.component.scss',
  '../../routes/routes-inventory/routes-inventory.component.scss',
  '../../travel/airport-transfers/airport-transfers.component.scss'
],
})
export class PendingRequestComponent implements OnInit, OnDestroy {
  tripRequests: TripRequest[] = [];
  error: any;
  routeData: Subscription;
  success: any;
  page: number;
  previousPage: any;
  pageSize: number;
  totalItems: number;
  private approvalDeclineDialog: MatDialogRef<TripApproveDeclineModalComponent, any>;

  constructor(
    private tripRequestService: TripRequestService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private appEventService: AppEventService,
  ) {
    this.pageSize = ITEMS_PER_PAGE;
    this.page = 1;
    this.routeData = this.activatedRoute.data.subscribe((data) => {
      const { pagingParams } = data;
      if (pagingParams) {
        this.page = pagingParams.page;
        this.previousPage = pagingParams.page;
      }
    });
  }

  loadAll() {
    const { page, pageSize: size } = this;
    this.tripRequestService.query({ page, size, status: 'Approved' }).subscribe(tripData => {
      this.tripRequests = tripData.trips;
      this.totalItems = tripData.pageInfo.totalResults;
      this.appEventService.broadcast({ name: 'updateHeaderTitle', content: { badgeSize: this.totalItems } });
    });
  }

  ngOnInit() {
    this.loadAll();
    this.routeData = this.appEventService
      .subscribe('reInitializeTripRequest', () => {
        this.loadAll();
      });
  }

  confirm(tripRequest): void {
    this.openDialogModal(tripRequest);
  }

  decline(tripRequest): void {
    this.openDialogModal(tripRequest, true);
  }

  private openDialogModal(tripRequest, decline?: boolean) {
    const data = {
      status: (decline) ? 1 : 0,
      requesterFirstName: tripRequest.requester.name,
      tripId: tripRequest.id
    };
    this.approvalDeclineDialog = this.dialog.open(TripApproveDeclineModalComponent, {
      width: '592px',
      maxHeight: '600px',
      backdropClass: 'modal-backdrop',
      panelClass: 'route-decline-modal-panel-class',
      data
    });
  }

  ngOnDestroy(): void {
    this.routeData.unsubscribe();
  }

  updatePage(page) {
    this.page = page;
    this.loadAll();
  }
}
