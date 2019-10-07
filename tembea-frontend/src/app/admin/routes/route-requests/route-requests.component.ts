import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { RouteRequestService } from '../../__services__/route-request.service';
import { RouteRequest } from '../../../shared/models/route-request.model';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/shared/models/user.model';
import { AuthService } from '../../../auth/__services__/auth.service';
import { RouteApproveDeclineModalComponent } from '../route-approve-decline-modal/route-approve-decline-modal.component';
import { IRouteApprovalDeclineInfo } from 'src/app/shared/models/route-approve-decline-info.model';
import { AisService } from '../../__services__/ais.service';
import { AISData } from 'src/app/shared/models/ais.model';
import { AppEventService } from '../../../shared/app-events.service';

@Component({
  selector: 'app-route-requests',
  templateUrl: './route-requests.component.html',
  styleUrls: ['./route-requests.component.scss']
})
export class RouteRequestsComponent implements OnInit, OnDestroy {
  routesSubscription: Subscription;
  routes: RouteRequest[] = [];
  user: IUser;
  requesterData: AISData;
  private approvalDeclineDialog: MatDialogRef<RouteApproveDeclineModalComponent, any>;
  private activeRouteRequest: RouteRequest;
  private activeRouteIndex: number;

  constructor(
    public routeService: RouteRequestService,
    public dialog: MatDialog,
    private authService: AuthService,
    private appEventService: AppEventService,
    private userData: AisService
  ) {
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.loadAllRequest();
    this.routesSubscription = this.appEventService
      .subscribe('updateRouteRequestStatus', () => {
        this.loadAllRequest();
      });
  }

  private loadAllRequest() {
    this.routeService.getAllRequests().subscribe(this.handleResponse);
  }

  ngOnDestroy() {
    if (this.routesSubscription) {
      this.routesSubscription.unsubscribe();
    }
  }

  onClickRouteBox = (index, route: RouteRequest) => {
    this.activeRouteIndex = index;
    this.activeRouteRequest = route;
    if (route) {
      this.getRequesterData(route.engagement.fellow.email);
    }
  }

  isRouteActive(idx: number): Boolean {
    return this.activeRouteIndex === idx;
  }

  getCurrentRoute(): RouteRequest {
    return this.activeRouteRequest;
  }

  decline(): void {
    this.openDialogModal(true);
  }

  approve(): void {
    this.openDialogModal();
  }

  getRequesterData(email: string) {
    this.userData.getResponse(email)
      .subscribe(data => {
          this.requesterData = data;
        }
      );
  }

  private handleResponse = (val) => {
    this.routes = val;
    let routeRequest: RouteRequest;
    routeRequest = this.routes[0];
    this.onClickRouteBox(0, this.routes[0]);
    if (routeRequest) {
      this.getRequesterData(routeRequest.engagement.fellow.email);
    }
    this.appEventService.broadcast({
      name: 'updateHeaderTitle',
      content: { badgeSize: val.length, headerTitle: 'Route Requests' }
    });
  }

  private openDialogModal(decline?: boolean) {
    const routesRequests = this.activeRouteRequest;
    const data = <IRouteApprovalDeclineInfo>{
      status: (decline) ? 1 : 0,
      requesterFirstName: routesRequests.engagement.fellow.name,
      routeRequestId: routesRequests.id
    };
    this.approvalDeclineDialog = this.dialog.open(RouteApproveDeclineModalComponent, {
      width: '592px',
      backdropClass: 'modal-backdrop',
      panelClass: 'route-decline-modal-panel-class',
      data
    });
  }
}
