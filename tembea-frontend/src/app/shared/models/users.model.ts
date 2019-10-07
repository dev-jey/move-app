import { Deserializable } from './deserializable.model';

export class Users implements Deserializable<Users> {
  id: number | string;
  name:  string;
  slackId: string;
  phoneNo: string;
  email: string;
  defaultDestinationId: string;
  createdAt: Date | string;
  updatedAt: Date | string;

  deserialize(input: any): Users {
    Object.assign(this, input);
    return this;
  }
}
