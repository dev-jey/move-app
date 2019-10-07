/* tslint:disable max-line-length */
import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { TripRequestService } from './trip-request.service';
import { tripRequestMock } from './__mocks__/trip-request.mock';
import {DepartmentsModel} from 'src/app/shared/models/departments.model';
import {department} from 'src/app/shared/__mocks__/department.mock';
import { AlertService } from 'src/app/shared/alert.service';
import { AppTestModule } from '../../__tests__/testing.module';

describe('Trip Request Service', () => {
  let service: TripRequestService;
  let httpMock: HttpTestingController;
  let toastr: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestModule],
      providers: []
    });
    const injector: TestBed = getTestBed();
    service = injector.get(TripRequestService);
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

  describe('Service methods', async () => {
    it('should return a list of pending trips', (done) => {
      const requestedOn = tripRequestMock.requestedOn.toISOString();
      const departureTime = tripRequestMock.departureTime.toISOString();
      const returnedFromService = {
        pageMeta: { totalResults: 123 },
        trips: [{ ...tripRequestMock, requestedOn, departureTime }]
      };
      service
        .query({ status: 'Pending' })
        .subscribe(result => {
          expect(result.trips).toContainEqual(tripRequestMock);
          done();
        });

      const url = `${environment.tembeaBackEndUrl}/api/v1/trips`;
      const req = httpMock.expectOne({ method: 'GET' });
      expect(req.request.url).toBe(url);

      req.flush({ data: returnedFromService });
    });
  });

  it('should get all department', (done) => {
    const departmentMock: DepartmentsModel = {department};

    service.getDepartments()
      .subscribe(result => {
        expect(result).toBe(departmentMock.departments);
        done();
      });

    const departmentsUrl = `${environment.tembeaBackEndUrl}/api/v1/departments`;
    const req = httpMock.expectOne(departmentsUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(departmentMock);
    httpMock.verify();
  });

  describe('declineRequest', () => {
    it('should handle decline request', (done) => {
      jest.spyOn(service, 'handleResponse').mockImplementation();
      const comment = 'some comment';
      const { teamUrl: slackUrl } = environment;
      const mockResponse = {
        success: true,
        message: 'This trip request has been declined',
        data: {
          tripId: 1
        }
      };

      service.declineRequest(1, comment)
        .subscribe((result) => {
          expect(result).toEqual(mockResponse);
          expect(service.handleResponse).toHaveBeenCalledTimes(1);
          expect(service.handleResponse).toHaveBeenCalledWith(mockResponse, 'decline');
          done();
        });

      const request = httpMock.expectOne(`${service.tripUrl}/1?action=decline`);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toEqual({ comment, slackUrl });
      request.flush(mockResponse);
    });

    it('should decline request error', (done) => {
      const comment = 'some comment';
      const { teamUrl: slackUrl } = environment;

      service.declineRequest(1, comment)
        .subscribe(null, (result) => {
          expect(result.status).toEqual(400);
          expect(result.statusText).toEqual('Bad Request');
          expect(toastr.error).toHaveBeenCalledTimes(1);
          done();
        });

      const request = httpMock.expectOne(`${service.tripUrl}/1?action=decline`);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toEqual({ comment, slackUrl });
      request.flush('Server error', {
        status: 400,
        statusText: 'Bad Request'
      });
    });
  });

  describe('confirmRequest', () => {
    const values = {
      isAssignProvider: true,
      selectedProviderId : 16,
      comment: 'This trip is confirm'
    };
    const mockResponse = {
      success: true,
      message: 'This trip request has been confirmed',
      data: {
        tripId: 1
      }
    };
    const { teamUrl: slackUrl } = environment;
    it('should handle confirm trip request', (done) => {
      jest.spyOn(service, 'handleResponse').mockImplementation();

      service.confirmRequest(1, values)
        .subscribe((result) => {
          expect(service.handleResponse).toHaveBeenCalledTimes(1);
          expect(service.handleResponse).toHaveBeenCalledWith(result, 'confirm');
          done();
        });

      const request = httpMock.expectOne(`${service.tripUrl}/1?action=confirm`);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toEqual({ ...values, slackUrl });
      request.flush(mockResponse);
      done();
    });

    it('should throw confirm request error', (done) => {
      jest.spyOn(service, 'handleResponse').mockImplementation();

      service.confirmRequest(1, values)
        .subscribe(null, (result) => {
          expect(result.status).toEqual(400);
          expect(result.statusText).toEqual('Bad Request');
          expect(toastr.error).toHaveBeenCalledTimes(1);
          done();
        });

      const request = httpMock.expectOne(`${service.tripUrl}/1?action=confirm`);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toEqual({ ...values, slackUrl });
      request.flush('Server error', {
        status: 400,
        statusText: 'Bad Request'
      });
      done();
    });
  });

  describe('handleResponse', () => {
    it('should confirm the trip request', () => {
      service.handleResponse({ success: true }, 'confirm');
      expect(toastr.success).toHaveBeenCalledTimes(1);
      expect(toastr.success).toHaveBeenCalledWith('Trip request confirmd!');
    });
    it('should decline the trip request', () => {
      service.handleResponse({ success: false }, 'decline');
      expect(toastr.error).toHaveBeenCalledTimes(1);
      expect(toastr.error).toHaveBeenCalledWith('Could not decline request');
    });
  });
});
