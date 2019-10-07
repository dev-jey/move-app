import { TestBed, inject } from '@angular/core/testing';

import { UniversalRouteActivatorGuard } from './universal-route-activator.guard';
import { Router } from '@angular/router';
import { AuthService } from '../auth/__services__/auth.service';
import { CookieService } from '../auth/__services__/ngx-cookie-service.service';
import { mockAuthService } from '../auth/__mocks__/authService.mock';
import { JwtHelperService } from '@auth0/angular-jwt';
import { mockRouter } from './__mocks__/mockData';

describe('UniversalRouteActivatorGuard', () => {
  let routeGuard: UniversalRouteActivatorGuard;
  let authService: AuthService;
  let router: Router;
  let cookieService: CookieService;

  const mockCookieService = {
    get: () => 'token',
    delete: () => {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UniversalRouteActivatorGuard,
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: CookieService, useValue: mockCookieService }
      ]
    });

    routeGuard = TestBed.get(UniversalRouteActivatorGuard);
    authService = TestBed.get(AuthService);
    cookieService = TestBed.get(CookieService);
    router = TestBed.get(Router);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initiate guard', inject(
    [UniversalRouteActivatorGuard],
    (guard: UniversalRouteActivatorGuard) => {
      expect(guard).toBeTruthy();
    }
  ));

  describe('canActivate', () => {
    it('should allow user access the route', () => {
      jest.spyOn(routeGuard, 'checkLogin').mockReturnValue(true);

      const result = routeGuard.canActivate(null, null);
      expect(result).toEqual(true);
      expect(routeGuard.checkLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkLogin', () => {
    it('should authenticate user if the user has a valid token and return true', () => {
      const decodedTokenMock = { userInfo: { hi: 'user' } };
      jest.spyOn(routeGuard, 'redirectHome');
      jest.spyOn(authService, 'setCurrentUser');
      jest.spyOn(authService, 'setupClock');
      jest.spyOn(cookieService, 'get').mockReturnValue(true);
      jest
        .spyOn(JwtHelperService.prototype, 'isTokenExpired')
        .mockReturnValue(false);
      jest
        .spyOn(JwtHelperService.prototype, 'decodeToken')
        .mockReturnValue(decodedTokenMock);
      authService.isAuthenticated = false;

      const result = routeGuard.checkLogin();
      expect(result).toEqual(true);
      expect(authService.setCurrentUser).toHaveBeenCalledTimes(1);
      expect(authService.setCurrentUser).toHaveBeenCalledWith(
        decodedTokenMock.userInfo
      );
      expect(authService.setupClock).toHaveBeenCalledTimes(1);
      expect(routeGuard.redirectHome).toHaveBeenCalledTimes(0);
    });

    it('should call method to redirect user to the homepage when token is invalid token and return false', () => {
      const errMock = new Error('bad token');
      jest.spyOn(routeGuard, 'redirectHome');
      jest.spyOn(authService, 'setCurrentUser');
      jest.spyOn(authService, 'setupClock');
      jest.spyOn(cookieService, 'get').mockReturnValue(true);
      jest
        .spyOn(JwtHelperService.prototype, 'isTokenExpired')
        .mockReturnValue(false);
      jest
        .spyOn(JwtHelperService.prototype, 'decodeToken')
        .mockImplementation(() => {
          throw errMock;
        });
      authService.isAuthenticated = false;

      const result = routeGuard.checkLogin();
      expect(result).toEqual(false);
      expect(authService.setCurrentUser).toHaveBeenCalledTimes(0);
      expect(authService.setupClock).toHaveBeenCalledTimes(0);
      expect(routeGuard.redirectHome).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteTokenIfExpires', () => {
    it('should call method to delete token if expired', () => {
      const deleteMock = jest
        .spyOn(cookieService, 'delete')
        .mockImplementation();

      routeGuard.deleteTokenIfExpired(true);
      expect(deleteMock).toHaveBeenCalledTimes(1);
      expect(deleteMock).toHaveBeenCalledWith('tembea_token');
    });
  });

  describe('redirectHome', () => {
    it('should return false and call method to navigate to the landing page', () => {
      jest.spyOn(router, 'navigate');

      const result = routeGuard.redirectHome();
      expect(result).toEqual(false);
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
