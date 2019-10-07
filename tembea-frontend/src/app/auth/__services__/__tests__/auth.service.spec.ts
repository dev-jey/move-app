import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { AuthService } from '../auth.service';
import { CookieService } from '../ngx-cookie-service.service';
import { ClockService } from '../clock.service';
import { Router } from '@angular/router';
import { IUser } from 'src/app/shared/models/user.model';
import { of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../shared/alert.service';
import { SpyObject } from '../../../__mocks__/SpyObject';
import { mockToastr } from '../../../shared/__mocks__/mockData';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;
  let injector;

  let mockRouter;
  let mockClockService;
  let mockCookieService;

  const response = { id: '121', name: 'james' };
  const { tembeaBackEndUrl } = environment;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CookieService, useValue: new SpyObject(CookieService) },
        { provide: ClockService,  useValue: new SpyObject(ClockService) },
        { provide: Router,  useValue: new SpyObject(Router) },
        { provide: AlertService, useValue: mockToastr }
      ]
    });

    injector = getTestBed();
    authService = injector.get(AuthService);
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
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

  it('should not get current user', () => {
    const service: AuthService = TestBed.get(AuthService);
    const user = service.getCurrentUser();
    expect(user).toBeNull();
  });

  it('should set and get current user', () => {
    const service: AuthService = TestBed.get(AuthService);
    service.setCurrentUser({
      id: '1',
      firstName: 'John',
      first_name: 'John',
      lastName: 'Papa',
      last_name: 'Papa',
      email: 'john.papa@angular.ng',
      name: 'John Papa',
      picture: 'string',
      roles: []
    });
    const user: IUser = service.getCurrentUser();
    expect(user.id).toBe('1');
    expect(user.firstName).toBe('John');
  });

  it('should log user out', () => {
    const service: AuthService = TestBed.get(AuthService);
    service.clockSubscription = new Subscription();
    service.logout();
    expect(service.cookieService.delete).toHaveBeenCalledTimes(2);
    expect(service.isAuthenticated).toEqual(false);
  });

  it('should init the clock', () => {
    const service: AuthService = TestBed.get(AuthService);
    AuthService.lastActiveTime = 1000000000;
    jest.spyOn(service, 'logout');
    service.initClock();

    expect(service.logout).toHaveBeenCalledTimes(1);
  });

  it('should GET login info', () => {
    authService.login().subscribe(data => {
      expect(data).toEqual(response);
    });

    const loginRequest: TestRequest = httpTestingController.expectOne(
      `${tembeaBackEndUrl}/api/v1/auth/verify`
    );

    expect(loginRequest.request.method).toEqual('GET');

    loginRequest.flush(response);
  });

  it('should test authorize user method', () => {
    const token = 'token';
    const res = { userInfo: { firstName: 'boy' }, token };
    const toastrSpy = authService.toastr.success;
    const cookieSpy = authService.cookieService.set;
    authService.authorizeUser(res);

    expect(authService.isAuthorized).toEqual(true);
    expect(authService.isAuthenticated).toEqual(true);
    expect(authService.tembeaToken).toEqual(token);
    expect(toastrSpy).toHaveBeenCalledTimes(1);
    expect(toastrSpy).toHaveBeenCalledWith('Login Successful');
    expect(cookieSpy).toHaveBeenCalledTimes(1);
    expect(cookieSpy).toHaveBeenCalledWith('tembea_token', token, 0.125, '/');
  });

  it('should authorize a user', () => {
    const token = 'token';
    const res = { userInfo: { firstName: 'boy' }, token };
    const toastrSpy = authService.toastr.success;
    const cookieSpy = authService.cookieService.set;
    const initClockSpy = jest
      .spyOn(authService, 'initClock')
      .mockImplementation(() => {
      });
    authService.authorizeUser(res);

    expect(authService.isAuthorized).toEqual(true);
    expect(authService.isAuthenticated).toEqual(true);
    expect(authService.tembeaToken).toEqual(token);
    expect(toastrSpy).toHaveBeenCalledTimes(1);
    expect(toastrSpy).toHaveBeenCalledWith('Login Successful');
    expect(cookieSpy).toHaveBeenCalledTimes(1);
    expect(cookieSpy).toHaveBeenCalledWith('tembea_token', token, 0.125, '/');
    expect(initClockSpy).toHaveBeenCalledTimes(1);
  });

  it('should set the user as unAuthorized', () => {
    authService.unAuthorizeUser();

    expect(authService.isAuthorized).toEqual(false);
  });
});
