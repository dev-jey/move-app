import { Deserializable } from './deserializable.model';
import { IPageMeta } from './page-meta.model';

export class RouteInventoryModel implements Deserializable<RouteInventoryModel> {
  routes: IRouteInventory[] = [];
  pageMeta?: IPageMeta;

  deserialize(input: any): RouteInventoryModel {
    Object.assign(this, input);
    return this;
  }
}

export interface IRouteInventory {
  id?: number;
  status: string;
  takeOff: string;
  capacity: number;
  batch: string;
  comments?: string;
  inUse?: number;
  name: string;
  destination?: string;
  driverName?: string;
  driverPhoneNo?: string;
  regNumber: string;
}

export interface IDeleteRouteResponse {
  success: boolean;
  message: string;
}
