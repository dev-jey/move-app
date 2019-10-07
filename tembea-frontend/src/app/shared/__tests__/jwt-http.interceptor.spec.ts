import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/__services__/auth.service';
import { mockAuthService } from '../../auth/__mocks__/authService.mock';
import { mockRouter, mockToastr } from '../__mocks__/mockData';
import { JwtHttpInterceptor } from '../jwt-http.interceptor';
import { HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';
import { AlertService } from '../alert.service';

describe('JWTHttpInterceptor', () => {
  let interceptor: JwtHttpInterceptor;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JwtHttpInterceptor,
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: AlertService, useValue: mockToastr }
      ]
    });

    interceptor = TestBed.get(JwtHttpInterceptor);
    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create interceptor', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('Intercept method', () => {
    it('should next method without setting Authorization token', () => {
      authService.tembeaToken = 'token';
      const url = '/auth/verify';
      const reqMock = new HttpRequest('GET', url);
      const next = {
        handle: jest.fn(() => {})
      };

      interceptor.intercept(reqMock, next);
      expect(next.handle).toHaveBeenCalledWith(reqMock);
    });

    it('should next method and set Authorization token', () => {
      authService.tembeaToken = 'token';
      const url = '/auth/go';
      const reqMock = new HttpRequest('GET', url);
      const next = {
        handle: jest.fn(() => of({}))
      };
      jest.spyOn(reqMock, 'clone').mockReturnValue('cloned');

      interceptor.intercept(reqMock, next);
      expect(next.handle).toHaveBeenCalledWith('cloned');
    });
  });
});
