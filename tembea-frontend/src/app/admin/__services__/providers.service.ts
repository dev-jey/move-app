import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';
import { CreateDriverModel} from '../../shared/models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  providersUrl = `${environment.tembeaBackEndUrl}/api/v1/providers`;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(
    private http: HttpClient,
  ) { }

  getProviders(size: number, page: number): Observable<any> {
    return this.http
      .get<any>(`${this.providersUrl}?size=${size}&page=${page}`);
  }

  editProvider(provider: any, id: number): Observable<any> {
    return  this.http.patch<any>(`${this.providersUrl}/${id}`, provider);
  }

  deleteProvider(id: number): Observable<any> {
  return  this.http.delete(`${this.providersUrl}/${id}`);
  }

  add(data: Object): Observable<any> {
    return this.http.post<any>(this.providersUrl, {...data });
  }
  addDriver(data: CreateDriverModel): Observable<any> {
    const results = this.http.post(`${this.providersUrl}/drivers`, data);
    return  results;
  }
}
