import UserTripBookingController from './user-trip-booking-controller';
import cache from '../../../../cache';

describe('UserTripBookingController', () => {
  describe('savePickupDetails', () => {
    const [payload, res] = [{
      submission: {
        dateTime: '22/12/2019 10:55',
        pickup: 'Somewhere on Earth'
      },
      user: {
        // tz_offset: 3600,
        id: 'UIS233'
      }
    }, jest.fn()];

    beforeAll(() => jest.spyOn(cache, 'save').mockResolvedValue());

    it('should run successfully if payload is valid', async () => {
      await UserTripBookingController.savePickupDetails(payload, res);
      expect(res).toHaveBeenCalledTimes(0);
      expect(cache.save).toHaveBeenCalled();
    });

    it('should send error message when payload is invalid', async () => {
      const data = { ...payload };
      data.submission.pickup = 'Others';

      await UserTripBookingController.savePickupDetails(payload, res);
      expect(res).toHaveBeenCalledWith({
        errors: [{ error: '"othersPickup" is required', name: 'othersPickup' }]
      });
    });
  });
});
