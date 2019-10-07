import UserTripHelpers from './user-trip-helpers';
import { Cache } from '../../../slack/RouteManagement/rootFile';
import { getTripKey } from '../../../../helpers/slack/ScheduleTripInputHandlers';

describe('UserTripHelpers', () => {
  describe('handlePickupDetails', () => {
    let cacheSpy;

    beforeEach(() => {
      jest.spyOn(UserTripHelpers, 'updateTripData')
        .mockImplementation((userId, d) => ({
          id: userId,
          pickup: d.pickup,
          othersPickup: d.othersPickup,
          dateTime: d.dateTime,
          departmentId: 5
        }));

      cacheSpy = jest.spyOn(Cache, 'saveObject').mockResolvedValue();
    });

    it('should update the trip data and save to cache', async () => {
      const data = {
        dateTime: new Date(2019, 6, 31, 23, 55).toISOString(),
        pickup: 'Test Location'
      };
      const testUserId = 'U1479';

      await UserTripHelpers.handlePickUpDetails(testUserId, data);

      expect(cacheSpy).toHaveBeenCalledWith(getTripKey(testUserId), expect.objectContaining(data));
    });
  });
});
