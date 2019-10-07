import { DriversInventoryService } from './drivers-inventory.service';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import getDriversResponseMock from '../../__mocks__/drivers.mock';

describe('DriverInventoryService', () => {
  let injector: TestBed;
  let service: DriversInventoryService;
  const getDriversResponse = getDriversResponseMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    });
    injector = getTestBed();
    service = injector.get(DriversInventoryService);
  });

  describe('getCabs', () => {
    it('should get all Drivers', () => {
      const httpSpy = jest.spyOn(HttpClient.prototype, 'get');
      httpSpy.mockReturnValue(of(getDriversResponse));
      let drivers;
      const result = service.get(2, 2, 'name,asc,batch,asc', 1);
      result.subscribe(value => {
        drivers = value;
        expect(drivers).toEqual(getDriversResponseMock.drivers);
      });
    });
    it('should edit a driver', () => {
      const dummyDriver = {
        driverName: 'james',
        driverPhoneNo: 213213213,
        driverNumber: 678923,
        email: 'james@andla.com'
      };
      const updateHttpSpy = jest.spyOn(HttpClient.prototype, 'put');
      updateHttpSpy.mockReturnValue(of(dummyDriver));
      const res = service.updateDriver(
        dummyDriver, 1, 1);
      res.subscribe(value => {
        expect(value).toEqual(dummyDriver);
      });
    });
  });
  describe('deleteCab', () => {
    it('should delete a driver', () => {
      const responseMock = {
        success: true,
        message: 'Driver successfully deleted',
      };

      const httpSpy = jest.spyOn(HttpClient.prototype, 'delete');
      httpSpy.mockReturnValue(of(responseMock));
      const result = service.deleteDriver(1, 1);
      result.subscribe(response => {
        expect(response).toEqual(responseMock);
      });
    });
  });
});
