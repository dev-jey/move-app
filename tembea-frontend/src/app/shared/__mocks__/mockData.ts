export const mockActivatedRoute = {
  snapshot: {
    queryParams: {
      token: 'authToken'
    }
  }
};

export const mockRouter = {
  navigate: () => {
  }
};

export const mockToastr = {
  // @ts-ignore
  success: jest.fn(),
  // @ts-ignore
  warning: jest.fn(),
  // @ts-ignore
  info: jest.fn(),
  // @ts-ignore
  error: jest.fn()
};

export const mockCookieService = {
  delete: () => {
  },
  set: () => {
  }
};
