import { TestBed, inject } from '@angular/core/testing';

import { HomeRouteActivatorGuard } from './home-route-activator.guard';
import { AuthService } from '../auth/__services__/auth.service';
import { CookieService } from '../auth/__services__/ngx-cookie-service.service';
import { Router, Route } from '@angular/router';
import { authServiceMock } from '../auth/__mocks__/authService.mock';
import { MatDialog } from '@angular/material';
import { matDialogMock } from './__mocks__/matDialog.mock';

describe('HomeRouteActivatorGuard', () => {
  let authService: AuthService;
  let dialog: MatDialog;
  let router: Router;
  let cookieService: CookieService;

  const mockCookieService = {
    get: () => 'token'
  };

  const mockRouter = {
    navigate: () => { }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HomeRouteActivatorGuard,
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: authServiceMock },
        { provide: CookieService, useValue: mockCookieService },
        { provide: MatDialog, useValue: matDialogMock }
      ]
    });

    authService = TestBed.get(AuthService);
    dialog = TestBed.get(MatDialog);
    cookieService = TestBed.get(CookieService);
    router = TestBed.get(Router);
  });

  it('should ...', inject([HomeRouteActivatorGuard], (guard: HomeRouteActivatorGuard) => {
    expect(guard).toBeTruthy();
  }));

  describe('CanActivate', () => {
    it('should call method to display the modal when user is unAuthorized',
      inject([HomeRouteActivatorGuard], (guard: HomeRouteActivatorGuard) => {
      authService.isAuthorized = false;

      const mockDialog = jest.spyOn(dialog, 'open');
      const result = guard.canActivate(null, null);

      expect(result).toEqual(true);
      expect(mockDialog).toHaveBeenCalledTimes(1);
    }));

    it('should navigate the user to the admin route when tembea_token exists',
      inject([HomeRouteActivatorGuard], (guard: HomeRouteActivatorGuard) => {
      const mockCookie = jest.spyOn(cookieService, 'get');
      const routerMock = jest.spyOn(router, 'navigate');

      authService.isAuthorized = true;

      const result = guard.canActivate(null, null);

      expect(result).toEqual(true);
      expect(mockCookie).toHaveBeenCalledTimes(2);
      expect(routerMock).toHaveBeenCalledTimes(1);
        expect(routerMock).toHaveBeenCalledWith(['/admin']);
    }));

    it('should navigate the user to the loginRedirect route when andela_token exists and user isn\'t authenticated',
      inject([HomeRouteActivatorGuard], (guard: HomeRouteActivatorGuard) => {
      const mockCookie = jest.spyOn(cookieService, 'get').mockImplementation((prop) => prop === 'jwt_token' ? 'token' : '');
      const routerMock = jest.spyOn(router, 'navigate');

      authService.isAuthorized = true;

      const result = guard.canActivate(null, null);

      expect(result).toEqual(false);
      expect(mockCookie).toHaveBeenCalledTimes(2);
      expect(routerMock).toHaveBeenCalledTimes(1);
      expect(routerMock).toHaveBeenCalledWith(['/login/redirect'], { 'queryParams': { 'token': 'token' } });
    }));

    it('should allow user navigate to the landing page',
      inject([HomeRouteActivatorGuard], (guard: HomeRouteActivatorGuard) => {
      const mockCookie = jest.spyOn(cookieService, 'get').mockReturnValue('');
      const routerMock = jest.spyOn(router, 'navigate');

      authService.isAuthorized = true;

      const result = guard.canActivate(null, null);

      expect(result).toEqual(true);
      expect(mockCookie).toHaveBeenCalledTimes(2);
      expect(routerMock).toHaveBeenCalledTimes(0);
    }));
  });
});
