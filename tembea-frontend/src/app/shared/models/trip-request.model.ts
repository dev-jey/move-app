import { Deserializable } from './deserializable.model';
import { Users } from './users.model';
import { Moment } from 'moment';

export enum TripStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
}

export interface IProvider {
  name: string;
  phoneNumber: string;
  email: string;
}

export class TripRequest  implements Deserializable<TripRequest>  {
  constructor(
    public id?: number,
    public status?: TripStatus,
    public type?: string,
    public passenger?: number,
    public department?: string,
    public destination?: string,
    public pickup?: string,
    public departureTime?: Moment,
    public requestedOn?: Moment,
    public rider?: Users,
    public flightNumber?: string,
    public requester?: Users,
    public approvedBy?: Users,
    public confirmedBy?: Users,
    public rating?: number,
    public operationsComment?: string,
    public managerComment?: string,
    public distance?: string,
    public approvalDate?: string,
    public provider?: IProvider,
    public decliner?: Users
  ) {
  }
  deserialize(input: any): TripRequest {
    Object.assign(this, input);
    return this;
  }
}
