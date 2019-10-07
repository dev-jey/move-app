import { Deserializable } from './deserializable.model';

export class AISData implements Deserializable<AISData> {
  email: 'test.user@test.com';
  first_name: 'Test';
  last_name: 'User';
  name: 'Test User';
  picture: 'pictureUri';

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
