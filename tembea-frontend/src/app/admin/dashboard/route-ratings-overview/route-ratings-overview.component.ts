import { Component, Input, OnInit } from '@angular/core';
import { RouteRatingsModel } from '../../../shared/models/route-ratings.model';

@Component({
  selector: 'app-route-ratings-overview',
  templateUrl: './route-ratings-overview.component.html',
  styleUrls: ['./route-ratings-overview.component.scss']
})
export class RouteRatingsOverviewComponent implements OnInit {
  @Input() ratings: Array<RouteRatingsModel>;
  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }

}
