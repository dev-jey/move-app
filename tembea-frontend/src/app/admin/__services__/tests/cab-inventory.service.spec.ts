import { CabsInventoryService } from '../cabs-inventory.service';
import { responseMock, getCabsMock, createCabMock, updateCabMock, updateResponse } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CabInventoryModel } from 'src/app/shared/models/cab-inventory.model';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('CabInventoryService', () => {
  let injector: TestBed;
  let service: CabsInventoryService;
  let httpMock: HttpTestingController;
  const getCabsResponse = new CabInventoryModel().deserialize(getCabsMock);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: []
    });
    injector = getTestBed();
    service = injector.get(CabsInventoryService);
    httpMock = injector.get(HttpClientTestingModule);
  });

  describe('getCabs', () => {
    it('should get all Cabs', () => {
      const httpSpy = jest.spyOn(HttpClient.prototype, 'get');
      httpSpy.mockReturnValue(of(getCabsResponse));
      let cabs;
      const result = service.get(2, 2, 'name,asc,batch,asc', 1);
      result.subscribe(value => {
        cabs = value;
        expect(cabs).toEqual(getCabsMock.cabs);
      });
    });
  });
  describe('addCab', () => {
    it('should add a new cab', () => {
      const httpSpy = jest.spyOn(HttpClient.prototype, 'post');
      httpSpy.mockReturnValue(of(responseMock));
      let cab;
      const result = service.add(createCabMock);
      result.subscribe(value => {
        cab = value;
        expect(cab).toEqual(responseMock);
      });
    });
  });

  describe('updateCab', () => {
    it('should add a new cab', () => {
      const httpSpy = jest.spyOn(HttpClient.prototype, 'put');
      httpSpy.mockReturnValue(of(responseMock));
      let cab;
      const { id } = updateCabMock;
      const result = service.update(updateCabMock, id);
      result.subscribe(value => {
        cab = value;
        expect(cab).toEqual(updateResponse);
      });
    });
  });

  describe('deleteCab', () => {
    it('should delete a cab', () => {
      const httpSpy = jest.spyOn(HttpClient.prototype, 'delete');
      httpSpy.mockReturnValue(of(responseMock));
      let cab;
      const result = service.delete(1);
      result.subscribe(value => {
        cab = value;
        expect(cab).toEqual(responseMock);
      });
    });
  });
});
