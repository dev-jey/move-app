import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouteRequest } from '../../shared/models/route-request.model';
import { environment } from '../../../environments/environment';
import { map, retry, tap } from 'rxjs/operators';
import 'rxjs-compat/add/operator/map';
import { IRouteDetails } from '../../shared/models/route-approve-decline-info.model';
import { AlertService } from '../../shared/alert.service';

@Injectable({
  providedIn: 'root'
})
export class RouteRequestService {
  routesUrl = `${environment.tembeaBackEndUrl}/api/v1/routes`;

  constructor(private http: HttpClient, public toastr: AlertService) {}

  getAllRequests(): Observable<RouteRequest[]> {
    return this.http.get<{ routes: RouteRequest[] }>(`${this.routesUrl}/requests`)
      .pipe(
        retry(3),
        map((data) => data.routes.map(value => new RouteRequest().deserialize(value)))
      );
  }

  declineRequest(id: number, comment: string): Observable<any> {
    const newOpsStatus = 'decline';
    const { teamUrl } = environment;
    return this.http.put(`${this.routesUrl}/requests/status/${id}`, {
      comment, newOpsStatus, teamUrl,
    })
      .pipe(tap((data) => this.handleResponse(data, 'decline'), this.handleError));
  }

  approveRouteRequest(id: number, comment: string, routeDetails: IRouteDetails, provider: object): Observable<any> {
    return this.http.put(`${this.routesUrl}/requests/status/${id}`, {
      newOpsStatus: 'approve',
      comment: comment,
      teamUrl: environment.teamUrl,
      routeName: routeDetails.routeName,
      takeOff: routeDetails.takeOff,
      provider: provider,
    })
      .pipe(tap((data) => this.handleResponse(data, 'approve'), this.handleError));
  }

  handleError = () => {
    this.toastr.error('Something did not work right there.');
  }

  handleResponse = (data, status: 'approve' | 'decline') => {
    if (data.success) {
      this.toastr.success(`Route request ${status}d!`);
    } else {
      this.toastr.error(`Could not ${status} request`);
    }
  }
}
