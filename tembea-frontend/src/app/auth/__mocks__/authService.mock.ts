import { Observable, of } from 'rxjs';

export const authServiceMock = {
  isAuthorized: true,
  authUrl: 'test-url',
  andelaAuthServiceToken: 'xxxxx',
  userInfo: 'testUser',
  isAuthenticated: false,
  http: {},
  verifyLogin: {}
};

export const mockAuthService = {
  andelaAuthServiceToken: '',
  isAuthorized: '',
  isAuthenticated: '',
  tembeaToken: '',
  currentUser: {},
  login: (): Observable<any> => {
    return of({
      data: {
        isAuthorized: true
      }
    });
  },
  setCurrentUser: (): void => { },
  initClock: (): void => { },
  authorizeUser: (): void => { },
  unAuthorizeUser: (): void => { },
  setupClock: (): void => { },
  setAisToken: (): void => { },
};
