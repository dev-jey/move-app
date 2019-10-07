import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';

import { PendingRequestComponent } from './pending-request.component';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { AngularMaterialModule } from '../../../angular-material.module';
import { ActivatedRouteMock } from '../../../__mocks__/activated.router.mock';
import { TripRequestService } from '../../__services__/trip-request.service';
import { tripRequestMock } from '../../__services__/__mocks__/trip-request.mock';
import { AppEventService } from 'src/app/shared/app-events.service';
import { SpyObject } from '../../../__mocks__/SpyObject';
import { AppTestModule } from '../../../__tests__/testing.module';

describe('PendingRequestComponent Unit Test', () => {
  let component: PendingRequestComponent;
  let fixture: ComponentFixture<PendingRequestComponent>;
  let tripRequestService: TripRequestService;
  let appEventService: AppEventService;
  let activatedRoute: ActivatedRoute;
  let matDialog: any;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [PendingRequestComponent, EmptyPageComponent],
      imports: [HttpClientTestingModule, AngularMaterialModule, AppTestModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteMock()
        },
        { provide: MatDialog, useValue: new SpyObject(MatDialog) }
      ]
    })
    .overrideTemplate(PendingRequestComponent, `<div></div>`)
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingRequestComponent);
    component = fixture.componentInstance;
    tripRequestService = fixture.debugElement.injector.get(TripRequestService);
    appEventService = fixture.debugElement.injector.get(AppEventService);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    fixture.detectChanges();
  });

  beforeEach(() => {
    const trips = Object.assign({}, tripRequestMock);
    const pageInfo = {
      totalResults: 12,
    };
    jest.spyOn(appEventService, 'broadcast');
    jest.spyOn(tripRequestService, 'query')
      .mockReturnValue(of({ trips: [trips], pageInfo }));
  });

  beforeEach(inject([MatDialog],
    (_matDialog) => {
      matDialog = _matDialog;
      _matDialog.open.mockImplementation();
    }));

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load all trip request', () => {
      const trips = Object.assign({}, tripRequestMock);
      const pageInfo = {
        totalResults: 12,
      };
      jest.spyOn(tripRequestService, 'query')
        .mockReturnValue(of({ trips: [trips], pageInfo }));
      component.pageSize = 100;
      component.page = 1;

      component.ngOnInit();

      expect(tripRequestService.query).toHaveBeenCalledWith({ page: 1, size: 100, status: 'Approved' });
      expect(appEventService.broadcast).toHaveBeenCalled();
    });
  });

  describe('updatePage', () => {
    it('should update page', () => {
      component.updatePage(123);

      expect(tripRequestService.query).toHaveBeenCalledWith({ page: 123, size: 20, status: 'Approved' });
      expect(appEventService.broadcast).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from activated route data', () => {
      jest.spyOn(component.routeData, 'unsubscribe');

      component.ngOnDestroy();

      expect(component.routeData.unsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('confirm trip', () => {
    it('should handle decline', () => {
      const tripRequest = tripRequestMock;
      component.confirm(tripRequest);
      expect(matDialog.open).toHaveBeenCalled();
      expect(matDialog.open.mock.calls[0][1].data).toEqual({
        status: 0,
        requesterFirstName: tripRequest.requester.name,
        tripId: tripRequest.id
      });
    });
  });

  describe('decline trip', () => {
    it('should handle decline', () => {
      const tripRequest = tripRequestMock;
      component.decline(tripRequest);
      expect(matDialog.open).toHaveBeenCalled();
      expect(matDialog.open.mock.calls[0][1].data).toEqual({
        status: 1,
        requesterFirstName: tripRequest.requester.name,
        tripId: tripRequest.id
      });
    });
  });
});
