import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { createRequestOption } from 'src/app/utils/request-util';
import { TripRequestService } from './trip-request.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  exportToPDFUrl = `${environment.tembeaBackEndUrl}/api/v1/export/pdf`;
  exportToCSVUrl = `${environment.tembeaBackEndUrl}/api/v1/export/csv`;

  constructor(
    private http: HttpClient
  ) { }

  exportData(tableName, sort, filterParams, dataType): Observable<any> {
    let params;
    if (filterParams) {
      const reqDate = TripRequestService.flattenDateFilter(filterParams);
      params = createRequestOption(reqDate);
    }
    const applicationType = `application/${dataType}`;
    const url = dataType === 'pdf' ? this.exportToPDFUrl : this.exportToCSVUrl;
    return this.http.get(`${url}?table=${tableName}&sort=${sort}`,
    {
      params,
      responseType: 'arraybuffer',
      headers: { 'Accept': applicationType }
    }).pipe(retry(3));
  }
}
