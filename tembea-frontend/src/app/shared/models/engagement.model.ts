import { Deserializable } from './deserializable.model';
import { Users } from './users.model';
import { Partner } from './partner.model';

export class Engagement implements Deserializable<Engagement> {
  id: number | string;
  partnerId: number | string;
  fellowId: number | string;
  startDate: Date | string;
  endDate: Date | string;
  workHours: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  partner: Partner;
  fellow: Users;

  deserialize(input: any): Engagement {
    Object.assign(this, input);
    this.partner = new Partner().deserialize(input.partner);
    this.fellow = new Users().deserialize(input.fellow);
    return this;
  }
}
