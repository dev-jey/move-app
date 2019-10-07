import { IDriverModel } from './../../shared/models/driver.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';
import { DriverInventoryModel } from '../../shared/models/base.model';
import { BaseInventoryService } from './base-inventory-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class DriversInventoryService extends BaseInventoryService<IDriverModel, DriverInventoryModel> {
  providersBaseUrl = `${environment.tembeaBackEndUrl}/api/v1/providers`;
  constructor(http: HttpClient) {
    super(`${environment.tembeaBackEndUrl}/api/v1/drivers`, http);
  }

  deleteDriver(providerId: number, driverId: number): Observable<any> {
    return this.http.delete(`${this.providersBaseUrl}/${providerId}/drivers/${driverId}`, this.httpOptions);
  }
  updateDriver(data: any, id: number, providerId: number): Observable<any> {
    return this.http.put(`${this.providersBaseUrl}/${providerId}/drivers/${id}`, data, this.httpOptions);
  }
}
