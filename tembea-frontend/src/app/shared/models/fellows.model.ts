import { Deserializable } from './deserializable.model';
import { IPageMeta } from './page-meta.model';

export class FellowsModel implements Deserializable<FellowsModel> {
  fellows: [] = [];
  pageMeta: IPageMeta;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

export interface ISerializedFellowDetail {
  id: number;
  name: string;
  image: string;
  partner: string;
  tripsTaken: string;
  startDate: string;
  endDate: string;
}
