import { getTestBed, TestBed } from '@angular/core/testing';

import { RouteRequestService } from './route-request.service';
import { HttpTestingController } from '@angular/common/http/testing';
import getAllResponseMock from '../routes/route-requests/__mocks__/get-all-response.mock';
import { AppTestModule } from '../../__tests__/testing.module';
import { environment } from '../../../environments/environment';
import { AlertService } from '../../shared/alert.service';

describe('RoutesService', () => {
  let service: RouteRequestService;
  let httpMock: HttpTestingController;
  let toastr: AlertService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule],
      providers: []
    });

    const injector: TestBed = getTestBed();
    service = injector.get(RouteRequestService);
    httpMock = injector.get(HttpTestingController);
    toastr = injector.get(AlertService);
  });

  afterEach(() => {
    httpMock.verify();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllRequests(): should return all pending routes', (done) => {
    service.getAllRequests().subscribe((result) => {
      expect(result).toEqual(getAllResponseMock.routes);
      done();
    });

    const request = httpMock.expectOne(`${service.routesUrl}/requests`);
    expect(request.request.method).toEqual('GET');
    request.flush(getAllResponseMock);
  });

  describe('declineRequest', () => {
    it('should tap and handle decline request', (done) => {
      jest.spyOn(service, 'handleResponse').mockImplementation();

      const comment = 'some comment';
      const { teamUrl } = environment;

      const mockResponse = {
        success: true,
        message: 'This route request has been updated',
        data: { id: 1 }
      };

      service.declineRequest(1, comment)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          expect(service.handleResponse).toHaveBeenCalledTimes(1);
          expect(service.handleResponse).toHaveBeenCalledWith(mockResponse, 'decline');
          done();
        });

      const request = httpMock.expectOne(`${service.routesUrl}/requests/status/1`);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toEqual({ comment, newOpsStatus: 'decline', teamUrl });
      request.flush(mockResponse);
    });
    it('should tap and decline request error', (done) => {

      const comment = 'some comment';
      const { teamUrl } = environment;

      service.declineRequest(1, comment)
        .subscribe(null, (result) => {
          expect(result.status).toEqual(400);
          expect(result.statusText).toEqual('Bad Request');
          expect(toastr.error).toHaveBeenCalledTimes(1);
          done();
        });

      const request = httpMock.expectOne(`${service.routesUrl}/requests/status/1`);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toEqual({ comment, newOpsStatus: 'decline', teamUrl });
      request.flush('Server error', {
        status: 400,
        statusText: 'Bad Request'
      });
    });
  });

  describe('approveRouteRequest', () => {
    const routeDetails = {};
    const comment = 'some comment';
    const { teamUrl } = environment;
    const provider = { id: 1, name: 'Andela Kenya', providerUserId: 15};
    const updatedRouteDetails = {
      comment: 'some comment',
      newOpsStatus: 'approve',
      provider: { id: 1, name: 'Andela Kenya', providerUserId: 15 },
      routeName: 'Some route name',
      takeOff: '2:30',
      teamUrl: 'andela-tembea.slack.com'
    };

    let mockResponse;
    beforeEach(() => {
      jest.spyOn(service, 'handleResponse').mockImplementation();
      routeDetails['routeName'] = 'Some route name';
      routeDetails['takeOff'] = '2:30';
      routeDetails['providerName'] = 'Rides';

      mockResponse = {
        success: true,
        message: 'This route request has been updated',
        data: { id: 1 }
      };
    });

    it('should call handleApproveRouteResponse', (done) => {
      service.approveRouteRequest(1, comment, routeDetails, provider)
        .subscribe((result) => {
          expect(service.handleResponse).toHaveBeenCalledTimes(1);
          expect(result.provider).toHaveBeenCalledWith(result, 'approve');
          done();
        });

      const request = httpMock.expectOne(`${service.routesUrl}/requests/status/1`);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toEqual({ ...updatedRouteDetails, comment, teamUrl, newOpsStatus: 'approve' });

      request.flush(mockResponse);

      jest.restoreAllMocks();
      done();
    });
    it('should tap and approve request error', (done) => {
      service.approveRouteRequest(1, comment, routeDetails, provider)
        .subscribe(null, (result) => {
          expect(result.status).toEqual(400);
          expect(result.statusText).toEqual('Bad Request');
          expect(toastr.error).toHaveBeenCalledTimes(1);
          done();
        });

      const request = httpMock.expectOne(`${service.routesUrl}/requests/status/1`);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toEqual({ ...updatedRouteDetails, comment, teamUrl, newOpsStatus: 'approve' });
      request.flush('Server error', {
        status: 400,
        statusText: 'Bad Request'
      });
    });
  });

  describe('handleResponse', () => {
    it('should create the route request', () => {
      service.handleResponse({ success: true }, 'approve');
      expect(toastr.success).toHaveBeenCalledTimes(1);
      expect(toastr.success).toHaveBeenCalledWith('Route request approved!');
    });
    it('should create the route request', () => {
      service.handleResponse({ success: false }, 'decline');
      expect(toastr.error).toHaveBeenCalledTimes(1);
      expect(toastr.error).toHaveBeenCalledWith('Could not decline request');
    });
  });

});
