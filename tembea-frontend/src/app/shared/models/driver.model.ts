import {IProviderRelatedModel} from './base.model';

export interface CreateDriverModel {
  providerId: number;
  email?: string;
  driverName: string;
  driverPhoneNo: number;
  driverNumber: string;
}

export interface IDriverModel extends IProviderRelatedModel {
  driverName: string;
  driverPhoneNo: string;
  driverNumber?: string;
  email: string;
}

export interface IResponseModel<T> {
  success: boolean;
  message: string;
  data: T;
}
