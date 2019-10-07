import { RouteUsageService } from '../route-usage.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import routeUsageMock from '../__mocks__/routeUsageMock';


describe('RouteUsageService', () => {
  let service: RouteUsageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ RouteUsageService ]
    });

    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(RouteUsageService);
  });

  afterEach(() => {
    httpMock.verify();
  });
  describe('getRouteUsage', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should make http request to get most used and least used routes', () => {
      service.getRouteUsage({
        from: { startDate: '2019-05-03' }, to: { endDate: '2019-05-06' }
    }).subscribe(usageData => {
      expect(usageData.mostUsedBatch).toBeDefined();
      expect(usageData.leastUsedBatch).toBeDefined();
    });

    const req = httpMock.expectOne('http://localhost:5000/api/v1/routes/status/usage?from=2019-05-03&to=2019-05-06');

    req.flush({ data: {...routeUsageMock } });
    });
  });
});
