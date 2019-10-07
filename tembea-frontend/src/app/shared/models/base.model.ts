import {IPageMeta} from './page-meta.model';
import {IDriverModel} from './driver.model';
import {ICabModel} from './cab-inventory.model';

export interface IBaseModel {
  id?: number;
}

export interface IProviderRelatedModel extends IBaseModel {
  providerId: number;
}


export class BaseInventoryModel<T> {
  pageMeta?: IPageMeta;
  data: T;
}

export class DriverInventoryModel extends BaseInventoryModel<IDriverModel[]> { }

export class CabInventoryModel extends BaseInventoryModel<ICabModel[]> { }
