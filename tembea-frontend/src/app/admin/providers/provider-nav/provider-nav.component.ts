import { Component, OnInit } from '@angular/core';
import {AppEventService} from '../../../shared/app-events.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-provider-nav',
  templateUrl: './provider-nav.component.html',
  styleUrls: ['./provider-nav.component.scss']
})
export class ProviderNavComponent implements OnInit {
  providerId: any;
  providerName: any;
  pageNo: number;
  pageSize: number;
  totalItems: number;
  isLoading: boolean;
  data: any = {};

  constructor(
    private appEventService: AppEventService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.providerId = params.providerId;
    });
  }

  tabChanged(event) {
    let broadcastPayload = {};
    const { tab: { textLabel } } = event;
    switch (textLabel) {
      case 'Vehicles':
        broadcastPayload = {
          headerTitle: `${this.data.providerVehicles.providerName} Vehicles`,
          badgeSize: this.data.providerVehicles.totalItems,
          providerId: this.providerId,
          actionButton: 'Add a New Vehicle'
        };
        break;
      case 'Drivers':
        broadcastPayload = {
          headerTitle: `${this.data.providerDrivers.providerName} Drivers`,
          badgeSize: this.data.providerDrivers.totalItems,
          providerId: this.providerId,
          actionButton: 'Add Driver'
        };
        break;
    }

    this.appEventService.broadcast({
      name: 'updateHeaderTitle',
      content: broadcastPayload
    });
  }

  updateProviderHeader(event) {
    this.data[event.providerTabRequestType] = event;
  }

}
