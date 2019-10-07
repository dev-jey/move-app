import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RoutesInventoryService } from './routes-inventory.service';
import { RouteInventoryModel } from '../../shared/models/route-inventory.model';
import getRoutesResponseMock from '../routes/routes-inventory/__mocks__/get-routes-response.mock';
import { environment } from '../../../environments/environment';

describe('Service Tests', () => {
  describe('Route Inventory Service', () => {
    let injector: TestBed;
    let service: RoutesInventoryService;
    let httpMock: HttpTestingController;
    const routesResponseMock: RouteInventoryModel = new RouteInventoryModel()
      .deserialize(getRoutesResponseMock);
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      injector = getTestBed();
      service = injector.get(RoutesInventoryService);
      httpMock = injector.get(HttpTestingController);

    });

    describe('Service methods', async () => {

      it('should update a route status', (done) => {
        const returnedFromService = Object.assign(
          routesResponseMock.routes[0],
          { status: 'Activated' }
        );

        const expected = Object.assign({}, returnedFromService);
        service
          .changeRouteStatus(1, { status: 'Activated' })
          .subscribe(resp => {
            expect(resp).toEqual({ ...expected });
            done();
          });
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        httpMock.verify();
      });

      it('should return a list of routes', (done) => {
        const returnedFromService = Object.assign({}, routesResponseMock);
        const expected = Object.assign({}, returnedFromService);
        const size = 1;
        const page = 2;
        const sort = 'id,asc';
        service
          .getRoutes(size, page, sort)
          .subscribe(result => {
            expect(result).toEqual(expected);
            done();
          });

        const url = `${environment.tembeaBackEndUrl}/api/v1/routes?sort=${sort}&size=${size}&page=${page}`;
        const req = httpMock.expectOne(url);
        expect(req.request.url).toBe(url);

        req.flush({ data: returnedFromService });
        httpMock.verify();
      });

    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
