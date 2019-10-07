import { Component, OnInit } from '@angular/core';
import { RouteUsageService } from '../__services__/route-usage.service';
import { RouteRatingsService } from '../__services__/route-ratings.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  dateFilters = {
    from: {},
    to: {},
  };
  mostUsedRoute: Object = {};
  leastUsedRoute: Object = {};
  mostRatedRoutes = [];
  leastRatedRoutes = [];

  constructor(
    private routeUsageService: RouteUsageService,
    private ratingsService: RouteRatingsService
  ) { }

  ngOnInit() {
    this.getRoutesUsage();
    this.getRouteRatings();
   }


  setDateFilter(field: string, range: 'from' | 'to', date: string) {
    const fieldObject = this.dateFilters[field] || {};
    this.dateFilters[field] = { ...fieldObject, [range]: date };
    this.getRoutesUsage();
    this.getRouteRatings();
  }

  getRoutesUsage() {
    this.routeUsageService.getRouteUsage(this.dateFilters).subscribe(routeUsageData => {
      const { mostUsedBatch, leastUsedBatch } = routeUsageData;
      const mostUsed = mostUsedBatch.emptyRecord ? { ...mostUsedBatch.emptyRecord } : { ...mostUsedBatch };
      const leastUsed = leastUsedBatch.emptyRecord ? { ...leastUsedBatch.emptyRecord } : { ...leastUsedBatch };
      this.mostUsedRoute = mostUsed;
      this.leastUsedRoute = leastUsed;

    });
  }

  getRouteRatings() {
    if (this.dateFilters.from && this.dateFilters.to) {
      this.ratingsService.getRouteAverages(this.dateFilters).subscribe(res => {
       const { data } = res;
        this.mostRatedRoutes = data.slice(0, 3);
        this.leastRatedRoutes = data.sort((a, b) =>  a.Average - b.Average).slice(0, 3);
      });
    }
  }
}
