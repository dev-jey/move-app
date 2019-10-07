import { AppEventService } from './../../../../shared/app-events.service';
import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-fellow-nav',
  templateUrl: './fellow-nav.component.html',
  styleUrls: ['./fellow-nav.component.scss']
})
export class FellowNavComponent implements OnInit {
  fellowsCount = {};

  constructor(private appEventService: AppEventService) {}
  ngOnInit() {}

  getSelectedTab(event) {
    const { textLabel } = event.tab;
    this.appEventService.broadcast({
      name: 'updateHeaderTitle',
      content: { badgeSize: this.fellowsCount[textLabel], tooltipTitle: textLabel }
    });
  }

  fellowsOnRouteCount(event: {onRoute: string, totalItems: number}) {
    this.fellowsCount[event.onRoute] = event.totalItems;
  }
}
