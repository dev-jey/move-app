import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class RouteRatingsService implements OnInit {
  constructor(private http: HttpClient) { }
  ngOnInit() {
  }

  getRouteAverages(dateFilter): Observable<any> {
    const fromStr = dateFilter.startDate ? `from=${dateFilter.startDate.from}` : null;
    const toStr = dateFilter.startDate ?  `to=${dateFilter.endDate.to}` : null;
    return  this.http.get(`${environment.tembeaBackEndUrl}/api/v1/routes/ratings?${fromStr}&${toStr}`);
  }
}
