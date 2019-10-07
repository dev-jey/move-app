import { CabInventoryModel } from '../../shared/models/base.model';
import { ICabModel } from '../../shared/models/cab-inventory.model';
import { BaseInventoryService } from './base-inventory-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root',
})

export class CabsInventoryService extends BaseInventoryService<ICabModel, CabInventoryModel> {
  constructor(http: HttpClient) {
    super(`${environment.tembeaBackEndUrl}/api/v1/cabs`, http);
  }
}
