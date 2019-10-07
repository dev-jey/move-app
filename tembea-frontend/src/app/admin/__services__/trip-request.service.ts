import { Observable } from 'rxjs';
import * as moment from 'moment';

import { environment } from 'src/environments/environment';
import {map, retry, filter, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {createRequestOption} from 'src/app/utils/request-util';
import {IPageMeta} from '../../shared/models/page-meta.model';
import {TripRequest} from 'src/app/shared/models/trip-request.model';
import {DepartmentsModel} from 'src/app/shared/models/departments.model';
import { AlertService } from '../../shared/alert.service';

export interface TripResponseData {
  pageInfo: IPageMeta;
  trips: TripRequest[];
}

@Injectable({ providedIn: 'root' })
export class TripRequestService {

  constructor(private http: HttpClient, public toastr: AlertService) {
  }
    tripUrl = `${environment.tembeaBackEndUrl}/api/v1/trips`;
    private departmentsUrl = `${environment.tembeaBackEndUrl}/api/v1/departments`;

  static flattenDateFilter(req: any) {
    const { dateFilters, ...result } = req;
    let flat = {};
    if (dateFilters) {
      const entries = Object.entries(dateFilters).map((entry) => {
        const [key, value] = entry;
        const modValue = Object.entries(value).map((item) => `${item[0]}:${item[1]}`).join(';');
        return [key, modValue];
      }) .filter(({1: val}) => val.length);
      flat = entries.reduce((obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }), {});
    }
    return { ...result, ...flat };
  }

  query(req?): Observable<TripResponseData> {
    const reqDate = TripRequestService.flattenDateFilter(req);
    const params = createRequestOption(reqDate);
    return this.http.get<any>(`${this.tripUrl}`, { params, observe: 'response' })
      .pipe(
        retry(2),
        map((res) => {
          const { trips, pageMeta: pageInfo } = res.body.data;
          trips.forEach((trip: TripRequest) => {
            trip.requestedOn = moment(trip.requestedOn);
            trip.departureTime = moment(trip.departureTime);
          });
          return { trips, pageInfo };
        })
      );
  }

  getDepartments(): Observable<DepartmentsModel> {
    return this.http.get<any>(`${this.departmentsUrl}`)
      .pipe(
        retry(3),
        map((res) => {
          const { departments } = res;
          return departments;
        })
      );
  }

  confirmRequest(tripId: number, values: any, ): Observable<any> {
    const isAssignProvider = true;
    const queryParam = 'confirm';
    const { teamUrl: slackUrl } = environment;
    const { comment, selectedProviderId } = values;
    return this.http.put(`${this.tripUrl}/${tripId}?action=${queryParam}`, {
      comment, slackUrl, isAssignProvider, selectedProviderId
    })
      .pipe(tap((data) => this.handleResponse(data, 'confirm'), this.handleError));
  }

  declineRequest(tripId: number, comment: string): Observable<any> {
    const queryParam = 'decline';
    const { teamUrl: slackUrl } = environment;
    return this.http.put(`${this.tripUrl}/${tripId}?action=${queryParam}`, {
      comment, slackUrl
    })
    .pipe(tap((data) => this.handleResponse(data, 'decline'), this.handleError));
  }

  handleError = () => {
    this.toastr.error('Something did not work right there.');
  }

  handleResponse = (data, status: 'confirm' | 'decline') => {
    if (data.success) {
      this.toastr.success(`Trip request ${status}d!`);
    } else {
      this.toastr.error(`Could not ${status} request`);
    }
  }
}


