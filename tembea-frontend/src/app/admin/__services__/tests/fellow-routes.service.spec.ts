import { FellowRouteService } from '../fellow-route.service';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';
import { FellowRoutesModel } from 'src/app/shared/models/fellow-routes.model';
import { fellowsMockResponse } from '../__mocks__/fellows.mock';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

describe('FellowRouteService', () => {
    let service: FellowRouteService;
    let httpMock: HttpTestingController;
    const fellowID = 1002;
    const pageSize = 10;
    const pageNo = 1;
    const sort = 'name,asc,batch,asc';

    const getFellowsMockResponse = new FellowRoutesModel().deserialize(
      fellowsMockResponse
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    const testBed = getTestBed();
    service = testBed.get(FellowRouteService);
    httpMock = testBed.get(HttpTestingController);
  });

  afterEach(jest.resetAllMocks);
  afterAll(jest.restoreAllMocks);

  it('should make http request to get fellows', () => {
    let res;
    jest
      .spyOn(service, 'getFellowRoutes')
      .mockReturnValue(of(getFellowsMockResponse));
    service.getFellowRoutes(fellowID, pageSize, pageNo, sort).subscribe(data => {
      res = data;
    });

    expect(res.data).toEqual(getFellowsMockResponse.data);
  });

  describe('removeFellowFromRoute', () => {
    it('should make a get http call to bvackend API', () => {
      const spy = jest.spyOn(HttpClient.prototype, 'get');
      const url = `${environment.tembeaBackEndUrl}/api/v1/fellowActivity?id=${fellowID}&size=${pageSize}&sort=${sort}&page=${pageNo}`;

      service.getFellowRoutes(fellowID, pageSize, pageNo, sort);

      expect(spy.mock.calls[0][0]).toEqual(url);
    });
  });
});
