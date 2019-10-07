import { Deserializable } from './deserializable.model';

export class Partner implements Deserializable<Partner> {
  id: number | string;
  name:  string;
  createdAt: Date | string;
  updatedAt: Date | string;

  deserialize(input: any): Partner {
    Object.assign(this, input);
    return this;
  }
}
