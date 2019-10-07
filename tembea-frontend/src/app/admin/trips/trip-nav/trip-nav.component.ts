import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppEventService } from 'src/app/shared/app-events.service';

@Component({
  selector: 'app-trip-nav',
  templateUrl: './trip-nav.component.html',
  styleUrls: ['./trip-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TripNavComponent implements OnInit {
  data: any = {};
  constructor(
    private appEventService: AppEventService,
  ) { }

  ngOnInit() {
  }
  getSelectedTab(event) {
    let broadcastPayload = {};
    switch (event.tab.textLabel) {
      case 'Past Trips':
        broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: this.data.pastTrips.totalItems };
        break;
      case 'All Trips':
        broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: this.data.all.totalItems };
        break;
      case 'Declined Trips':
        broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: this.data.declinedTrips.totalItems };
        break;
      case 'Upcoming Trips':
        broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: this.data.upcomingTrips.totalItems };
        break;
      case 'Awaiting Provider':
        broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: this.data.awaitingProvider.totalItems };
        break;
      default:
        broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: this.data.all.totalItems };
        break;
    }
    this.appEventService.broadcast({ name: 'updateHeaderTitle', content: broadcastPayload });
  }
  tripsTotal(event) {
    this.data[event.tripRequestType] = event;
  }
}
