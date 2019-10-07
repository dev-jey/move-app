import RouteHelper from '../RouteHelper';
import RouteService, { routeService } from '../../services/RouteService';
import { cabService } from '../../services/CabService';
import {
  routeBatch, batch, routeDetails, returnNullPercentage, record,
  confirmedRecord, returnedPercentage, percentagesList,
  singlePercentageArray, returnedMaxObj, returnedMinObj, emptyRecord, routeResult
} from '../__mocks__/routeMock';

describe('Route Helpers', () => {
  describe('checkTimeFormat', () => {
    it('should fail if time format does not match requirement', () => {
      const message = RouteHelper.checkTimeFormat('12:1', 'timeFormat');
      expect(message).toEqual(['timeFormat is invalid']);
    });
  });

  describe('checkNumberValues', () => {
    it('should fail if value is not a non-zero integer', () => {
      const message = RouteHelper.checkNumberValues('string', 'someField');
      expect(message).toEqual(['someField must be a non-zero integer greater than zero']);
    });
  });

  describe('checkNumberValues', () => {
    it('should fail if value is not a non-zero integer', () => {
      const message = RouteHelper.checkNumberValues('string', 'someField');
      expect(message).toEqual(['someField must be a non-zero integer greater than zero']);
    });
  });

  describe('checkCoordinates', () => {
    it('should fail if object does not contain either lat, lng, or both', () => {
      const message = RouteHelper.checkCoordinates({});
      expect(message).toEqual(['destination.coordinates must have lat & lng properties']);
    });
  });

  describe('checkThatVehicleRegNumberExists', () => {
    it('should return array containing results for the check', async () => {
      jest.spyOn(cabService, 'findByRegNumber').mockResolvedValue({ id: 1 });
      const result = await RouteHelper.checkThatVehicleRegNumberExists('AR 3GN UMBR');
      expect(Array.isArray(result)).toBeTruthy();
      expect(result[0]).toEqual(true);
    });

    it('should return array containing with first element false when vehicle absent', async () => {
      jest.spyOn(cabService, 'findByRegNumber').mockResolvedValue(null);
      const result = await RouteHelper.checkThatVehicleRegNumberExists('AR 3GN UMBR');
      expect(Array.isArray(result)).toBeTruthy();
      expect(result[0]).toEqual(false);
    });
  });

  describe('checkThatRouteNameExists', () => {
    it('should return array containing results for the check', async () => {
      jest.spyOn(routeService, 'getRouteByName').mockResolvedValue({ id: 2, });
      const result = await RouteHelper.checkThatRouteNameExists('Yaba');
      expect(Array.isArray(result)).toBeTruthy();
      expect(result[0]).toEqual(true);
    });

    it('should return array containing with first element false when route missing', async () => {
      jest.spyOn(routeService, 'getRouteByName').mockResolvedValue(null);
      const result = await RouteHelper.checkThatRouteNameExists('Yaba');
      expect(Array.isArray(result)).toBeTruthy();
      expect(result[0]).toEqual(false);
    });
  });


  describe('duplicateRouteBatch', () => {
    it('should return the newly created batch object', async () => {
      jest.spyOn(RouteService, 'getRouteBatchByPk').mockReturnValue(routeBatch);
      jest.spyOn(RouteHelper, 'getNewBatchDetails').mockReturnValue(batch);

      const result = await RouteHelper.duplicateRouteBatch(1);
      expect(result.batch).toBe('B');
      expect(result.inUse).toBe(0);
      expect(result).toBe(batch);
    });

    it('should not create batch if route batch does not exist', async () => {
      jest.spyOn(RouteService, 'getRouteBatchByPk').mockReturnValue(null);

      const result = await RouteHelper.duplicateRouteBatch(10);

      expect(result).toBe('Route does not exist');
    });
  });

  describe('getNewBatchDetails', () => {
    it('should get the batch object', async () => {
      jest.spyOn(RouteService, 'createRoute').mockReturnValue(routeDetails);
      jest.spyOn(RouteService, 'updateBatchLabel').mockReturnValue('B');
      jest.spyOn(RouteService, 'createBatch').mockReturnValue(batch);


      const result = await RouteHelper.getNewBatchDetails(routeBatch);
      expect(result.batch).toBe('B');
      expect(result.inUse).toBe(0);
      expect(result).toBe(batch);
    });
  });

  describe('batchObject', () => {
    it('add batch to routeBatch object', () => {
      const result = RouteHelper.batchObject(routeBatch, 'A');

      expect(result).toEqual({
        batch: 'A', capacity: 4, status: 'Active', takeOff: '03:00'
      });
    });
  });
  describe('findPercentageUsage, findMaxOrMin', () => {
    it('should calculate and return dormant routes', () => {
      const result = RouteHelper.findPercentageUsage(record, [], []);
      expect(result).toEqual(returnNullPercentage);
    });
    it('should calculate and return percentages', () => {
      const result = RouteHelper.findPercentageUsage(confirmedRecord, [], []);
      expect(result).toEqual(returnedPercentage);
    });
    it('should check the most used and least used route', () => {
      const resultMax = RouteHelper.findMaxOrMin(percentagesList, 'max');
      const resultMin = RouteHelper.findMaxOrMin(percentagesList, 'min');
      const resultNull = RouteHelper.findMaxOrMin([], 'min');
      const resultSingleRecord = RouteHelper.findMaxOrMin(singlePercentageArray, 'min');
      expect(resultMax).toEqual(returnedMaxObj);
      expect(resultMin).toEqual(returnedMinObj);
      expect(resultSingleRecord).toEqual(emptyRecord);
      expect(resultNull).toEqual({ emptyRecord });
    });
  });
  describe('RouteHelper.pageDataObject', () => {
    it('should return an object of the route data', () => {
      const routesData = RouteHelper.pageDataObject(routeResult);
      expect(routesData.pageMeta).toBeDefined();
      expect(routesData.pageMeta.totalPages).toBe(1);
      expect(routesData.pageMeta.totalResults).toBe(1);
      expect(routesData.pageMeta.pageSize).toBe(100);
    });
  });
});
