import { getTestBed, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/observable/of';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import getRoutesResponseMock from '../../routes/routes-inventory/__mocks__/get-routes-response.mock';
import { SearchService } from '../search.service';
import { CookieService } from '../../../auth/__services__/ngx-cookie-service.service';
import { ClockService } from '../../../auth/__services__/clock.service';
import { Router } from '@angular/router';
import { SpyObject } from '../../../__mocks__/SpyObject';
import { AlertService } from '../../../shared/alert.service';
import { mockToastr } from '../../../shared/__mocks__/mockData';
import { RouteInventoryModel } from '../../../shared/models/route-inventory.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


describe('SearchService', () => {
  let searchService: SearchService;
  let httpTestingController: HttpTestingController;
  let injector;

  let mockRouter;
  let mockClockService;
  let mockCookieService;
  const getRoutesResponse = new RouteInventoryModel().deserialize(
    getRoutesResponseMock
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CookieService, useValue: new SpyObject(CookieService) },
        { provide: ClockService, useValue: new SpyObject(ClockService) },
        { provide: Router, useValue: new SpyObject(Router) },
        { provide: AlertService, useValue: mockToastr }
      ]
    });

    injector = getTestBed();
    searchService = injector.get(SearchService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  beforeEach(() => {
    mockClockService = injector.get(ClockService);
    mockRouter = injector.get(Router);
    mockCookieService = injector.get(CookieService);

    mockCookieService.delete.mockReturnValue({});
    mockClockService.getClock.mockReturnValue(of(6000000000));
    mockRouter.navigate.mockResolvedValue({});
  });

  afterEach(() => {
    httpTestingController.verify();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(searchService).toBeTruthy();
  });

  it('should return filtered routes if route name provided', done => {
    const routeName = 'anyRoute';
    jest.spyOn(searchService, 'searchData').mockReturnValue(of(getRoutesResponse));
    searchService.searchData(of(routeName), 'routes').subscribe(value => {
      expect(value).toHaveProperty('routes');
      expect(value.routes).toEqual(getRoutesResponseMock.routes);
      done();
    });
  });

  it('should trigger searchItems()', done => {
    const routeName = 'anyRoute';
    jest.spyOn(searchService, 'searchItems').mockReturnValue(of(getRoutesResponseMock));
    searchService.searchData(of(routeName), 'routes').subscribe(value => {
      expect(searchService.searchItems).toHaveBeenCalled();
      done();
    });
  });

  it('searchItems should make http request to get list of routes batches', done => {
    const httpSpy = jest.spyOn(HttpClient.prototype, 'get');
    httpSpy.mockReturnValue(of(getRoutesResponseMock));
    const endpointUrl = `${environment.tembeaBackEndUrl}/api/v1/routes?name`;
    const searchTerm = 'hello';
    const result = searchService.searchItems(endpointUrl, searchTerm);
    result.subscribe(data => {
      expect(data).toEqual(getRoutesResponseMock);
      done();
    });
  });
});
