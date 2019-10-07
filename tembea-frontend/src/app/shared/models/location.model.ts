import { Deserializable } from './deserializable.model';

export class Location implements Deserializable<Location> {
  id: number | string;
  locationId: number | string;
  address: string;
  createdAt: Date | string;
  updatedAt: Date | string;

  deserialize(input: any): Location {
    Object.assign(this, input);
    return this;
  }
}
