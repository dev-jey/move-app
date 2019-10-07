import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FellowRoutesModel } from 'src/app/shared/models/fellow-routes.model';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class FellowRouteService {
  fellowRoutesUrl = `${environment.tembeaBackEndUrl}/api/v1/fellowActivity`;
  httpOptions = {
   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor( private http: HttpClient ) { }

  getFellowRoutes(fellowId, pageSize, pageNo, sort): Observable<FellowRoutesModel> {
    return this.http.get<any>(`${this.fellowRoutesUrl}?id=${fellowId}&size=${pageSize}&sort=${sort}&page=${pageNo}`)
    .map(fellowRoutes => {
      const fellowRoutesModel = new FellowRoutesModel().deserialize(fellowRoutes);
      return fellowRoutesModel;
    });
  }

}
