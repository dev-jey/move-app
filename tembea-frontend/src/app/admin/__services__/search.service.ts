import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/__services__/auth.service';

@Injectable({ providedIn: 'root' })
export class SearchService {
  baseUrl = `${environment.tembeaBackEndUrl}/api/v1/`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.auth.tembeaToken
    }),
  };

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  searchData(terms: Observable<string>, status: string) {
    const routesQuery = `${status}?name=`;
    return terms.debounceTime(1000)
      .distinctUntilChanged()
      .switchMap(term => this.searchItems(routesQuery, term.trim()))
      .map(items => {
        return items.data;
      });
  }

  searchItems(resourceEndpoint, term): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${resourceEndpoint}${term}`, this.httpOptions);
  }

}
