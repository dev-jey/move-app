import { Deserializable } from './deserializable.model';

interface FRouteMeta {
  pageNo?: number;
  itemsPerPage?: number;
  totalPages?: number;
  totalItems?: number;
}

export class FellowRoutesModel implements Deserializable<FellowRoutesModel> {
    pageMeta?: FRouteMeta;
    data: IFellowRoutes[] = [];
    deserialize(input: any): FellowRoutesModel {
      Object.assign(this, input);
      return this;
    }
}

 export interface IFellowRoutes {
    id: number;
    userId: number;
    rating: number | string;
    user: object;
    routeUseRecord: object;
}
