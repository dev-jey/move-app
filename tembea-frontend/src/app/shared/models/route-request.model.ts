import { Deserializable } from './deserializable.model';
import { Location } from './location.model';
import { Engagement } from './engagement.model';
import { Users } from './users.model';

export class RouteRequest implements Deserializable<RouteRequest> {
  id: number | string;
  distance: number | string;
  opsComment: string;
  managerComment: string;
  engagementId: number | string;
  managerId: number | string;
  busStopId: number | string;
  homeId: number | string;
  busStopDistance: number | string;
  routeImageUrl: string;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  engagement: Engagement;
  manager: Users;
  busStop: Location;
  home: Location;

  deserialize(input: any): RouteRequest {
    Object.assign(this, input);
    this.engagement = new Engagement().deserialize(input.engagement);
    this.manager = new Users().deserialize(input.manager);
    this.busStop = new Location().deserialize(input.busStop);
    this.home = new Location().deserialize(input.home);
    return this;
  }
}
