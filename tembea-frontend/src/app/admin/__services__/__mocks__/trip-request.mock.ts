import * as moment from 'moment';
import { TripRequest, TripStatus } from '../../../shared/models/trip-request.model';
import { Users } from '../../../shared/models/users.model';

const user = new Users().deserialize({
  'id': 123,
  'name': 'OOOOOO PPPPPP',
  'email': 'AAA.BBB@CCC.DDD',
  'slackId': 'ZZZZZZ',
});
export const tripRequestMock: TripRequest = new TripRequest().deserialize({
  'id': 1,
  'name': 'From Jomo Kenyatta Airport to Andela Nairobi on 22/12/2019 22:00',
  'status': TripStatus.PENDING,
  'arrivalTime': null,
  'type': 'Regular Trip',
  'departureTime': moment('2019-12-22T21:00:00.000Z'),
  'requestedOn': moment('2019-02-26T09:07:52.185Z'),
  'department': 'Finance-demo-update',
  'destination': 'Andela Nairobi',
  'pickup': 'Jomo Kenyatta Airport',
  'rider': user,
  'requester': user,
  'approvedBy': user
});
