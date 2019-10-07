import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FellowsModel } from 'src/app/shared/models/fellows.model';

@Injectable({
  providedIn: 'root'
})
export class FellowsService {
  fellowsUrl: string;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    body: { teamUrl: environment.teamUrl }
  };

  constructor(private http: HttpClient) {
    this.fellowsUrl = `${environment.tembeaBackEndUrl}/api/v1/fellows`;
  }
  getFellows(onRoute, size = 9, page = 1): Observable<any> {
    const queryParams = onRoute ? `size=${size}&page=${page}` : `onRoute=${false}&size=${size}&page=${page}`;
    return this.http
      .get<any>(`${this.fellowsUrl}?${queryParams}`)
      .map(fellows => {
        return new FellowsModel().deserialize(fellows);
      });
  }

  removeFellowFromRoute(fellowId: number) {
    const url = `${environment.tembeaBackEndUrl}/api/v1/routes/fellows/${fellowId}/`;
    return this.http.delete(url, this.httpOptions);
  }
}
