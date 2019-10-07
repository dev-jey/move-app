import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from './../../../environments/environment';
import {IResponseModel} from '../../shared/models/driver.model';

export abstract class BaseInventoryService<T, U> {
  teamUrl = environment.teamUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    body: { slackUrl: this.teamUrl }
  };
  protected constructor(
    private readonly baseUrl: string,
    protected http: HttpClient,
  ) { }

  get(size: number, page: number, sort: string, providerId: number): Observable<IResponseModel<U>> {
    return this.http
    .get<IResponseModel<U>>(`${this.baseUrl}?sort=${sort}&size=${size}&page=${page}&providerId=${providerId}`);
  }
  add(data: any): Observable<IResponseModel<T>> {
    return this.http.post<IResponseModel<T>>(`${this.baseUrl}`, {...data});
  }

  update(data: any, id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data , this.httpOptions);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, this.httpOptions);
  }
}
