import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { AISData } from 'src/app/shared/models/ais.model';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AisService {
  public baseUrl = `${environment.tembeaBackEndUrl}/api/v1/ais`;

  constructor(private httpClient: HttpClient) { }

  getResponse(email: string): Observable<AISData> {
    const httpOptions = {
      params: {
        email
      }
    };
    return this.httpClient.get<any>(this.baseUrl, httpOptions)
    .map(data => {
      let aisData: AISData;
      aisData = data.aisUserData;
      return new AISData().deserialize(aisData);
    });
  }
}
