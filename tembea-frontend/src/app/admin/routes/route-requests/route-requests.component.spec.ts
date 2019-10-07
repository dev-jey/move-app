import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { RouteRequestsComponent } from './route-requests.component';
import { HttpTestingController } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material';
import { AngularMaterialModule } from '../../../angular-material.module';
import { RouteRequestService } from '../../__services__/route-request.service';
import getAllResponseMock from './__mocks__/get-all-response.mock';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { CustomTitlecasePipe } from '../../__pipes__/custom-titlecase.pipe';
import { CookieService } from '../../../auth/__services__/ngx-cookie-service.service';
import { ClockService } from '../../../auth/__services__/clock.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Toastr, TOASTR_TOKEN } from '../../../shared/toastr.service';
import { AuthService } from '../../../auth/__services__/auth.service';
import { ConvertTimePipe } from 'src/app/admin/__pipes__/convert-time.pipe';
import { AisService } from '../../__services__/ais.service';
import { AppTestModule } from '../../../__tests__/testing.module';
import { AppEventService } from '../../../shared/app-events.service';
import { of } from 'rxjs';
import { SpyObject } from '../../../__mocks__/SpyObject';
import { RouteRequest } from '../../../shared/models/route-request.model';

const toastr: Toastr = window['toastr'];

describe('RouteRequestsComponent', () => {
  let component: RouteRequestsComponent;
  let fixture: ComponentFixture<RouteRequestsComponent>;
  let httpMock: HttpTestingController;
  let service: RouteRequestService;
  let appEventService: AppEventService;
  let matDialog: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RouteRequestsComponent, EmptyPageComponent, CustomTitlecasePipe, ConvertTimePipe],
      imports: [
        NoopAnimationsModule,
        AngularMaterialModule,
        RouterTestingModule,
        AppTestModule
      ],
      providers: [
        CookieService,
        ClockService,
        { provide: TOASTR_TOKEN, useValue: toastr },
        { provide: MatDialog, useValue: new SpyObject(MatDialog) },
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(RouteRequestsComponent);
    component = fixture.componentInstance;
    component.user = {
      id: '2',
      firstName: 'name',
      first_name: 'string',
      lastName: 'string',
      last_name: 'string',
      email: 'string',
      name: 'string',
      picture: 'string',
      roles: []
    };
    fixture.detectChanges();
  }));

  beforeEach(inject([RouteRequestService, HttpTestingController, AuthService, AppEventService, MatDialog, AisService],
    (_service, _httpMock, _authService, _appEventService, _matDialog, _aisService) => {
      service = _service;
      httpMock = _httpMock;
      appEventService = _appEventService;
      matDialog = _matDialog;
      _authService.getCurrentUser.mockReturnValue(({
        firstName: 'name',
        first_name: 'string',
        lastName: 'string',
        last_name: 'string',
        email: 'string',
        name: 'string',
        picture: 'string'
      }));
      _matDialog.open.mockImplementation();
      _aisService.getResponse.mockReturnValue(of({ picture: '' }));
    }));

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  it('should create RouteRequestsComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('Unit test', () => {

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });
    it('should properly initialize component', () => {
      const { routes } = getAllResponseMock;
      jest.spyOn(service, 'getAllRequests').mockReturnValue(of(<RouteRequest[]>routes));
      component.ngOnInit();
      expect(service.getAllRequests).toHaveBeenCalledTimes(1);
    });
    it('should properly initialize component', () => {
      const { routes } = getAllResponseMock;
      jest.spyOn(service, 'getAllRequests').mockReturnValue(of(<RouteRequest[]>routes));
      component.ngOnInit();
      appEventService.broadcast({ name: 'updateRouteRequestStatus' });
      expect(service.getAllRequests).toHaveBeenCalledTimes(3);
    });
    it('should handle decline', () => {
      const [route] = getAllResponseMock.routes;
      component.onClickRouteBox(0, <RouteRequest>route);
      component.decline();
      expect(matDialog.open).toHaveBeenCalled();
      expect(matDialog.open.mock.calls[0][1].data).toEqual({
        status: 1,
        requesterFirstName: route.engagement.fellow.name,
        routeRequestId: route.id
      });
    });

    it('should handle approve', () => {
      const [route] = getAllResponseMock.routes;
      component.onClickRouteBox(0, <RouteRequest>route);
      component.approve();
      expect(matDialog.open).toHaveBeenCalled();
      expect(matDialog.open.mock.calls[0][1].data).toEqual({
        status: 0,
        requesterFirstName: route.engagement.fellow.name,
        routeRequestId: route.id
      });
    });
  });

  it('Render Route Boxes: should render 3 route boxes with the first one active', () => {
    const request = httpMock.expectOne(`${service.routesUrl}/requests`);
    expect(request.request.method).toEqual('GET');
    request.flush(getAllResponseMock);

    fixture.detectChanges();
    const boxes = fixture.debugElement.queryAll(By.css('.route-box'));

    expect(boxes.length).toEqual(3);
    expect(Object.keys(boxes[0].properties)).toContain('className');
    expect(boxes[0].properties.className).toContain('active');

    expect(Object.keys(boxes[1].properties)).toContain('className');
    expect(boxes[1].properties.className).not.toContain('active');
  });

  it('onClickRouteBox(): should call onCLickRouterBox', () => {
    const request = httpMock.expectOne(`${service.routesUrl}/requests`);
    expect(request.request.method).toEqual('GET');
    request.flush(getAllResponseMock);
    fixture.detectChanges();

    const boxes = fixture.debugElement.queryAll(By.css('.route-box'));
    expect(boxes.length).toEqual(3);
    const secondBox = boxes[1];

    jest.spyOn(component, 'onClickRouteBox');

    expect(component.onClickRouteBox).not.toHaveBeenCalled();

    secondBox.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.onClickRouteBox).toHaveBeenCalledWith(1, getAllResponseMock.routes[1]);

    expect(Object.keys(boxes[1].properties)).toContain('className');
    expect(boxes[1].properties.className).toContain('active');
  });
});
