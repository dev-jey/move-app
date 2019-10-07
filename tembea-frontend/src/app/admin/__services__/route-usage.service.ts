import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable({
    providedIn: 'root',
  })

export class RouteUsageService {
  routeUsageUrl: string;

  constructor(private http: HttpClient) {
    this.routeUsageUrl = `${environment.tembeaBackEndUrl}/api/v1/routes/status/usage`;
  }

  getRouteUsage(dateFilter): Observable<any> {

    const { from: { startDate }, to: { endDate } } = dateFilter;

    const fromStr = startDate ? `from=${startDate}` : 'from=';
    const toStr = endDate ?  `to=${endDate}` : 'to=';

    return this.http.get<any>(`${this.routeUsageUrl}?${fromStr}&${toStr}`).map(usage => {
      const { data: { mostUsedBatch, leastUsedBatch } } = usage;
      return { mostUsedBatch, leastUsedBatch };
    });
  }
  }
