export const googleMapsServiceMock: any = {
  loadGoogleMaps(): Promise<void> { return Promise.resolve(); },
  getLocationAddressFromCoordinates(): Promise<any> { return Promise.resolve(); },
  getLocationCoordinatesFromAddress(): Promise<any> { return Promise.resolve(); },
  geocoder: '',
  mapLoader: '',
  initLibraries(element): Promise<void> { return Promise.resolve(); },
  lookUpAddressOrCoordinates(): Promise<{}> { return Promise.resolve({}); },
  retrieveLocationDetails() {
  }
};

export const routeServiceMock: any = {
  http: {},
  createRoute() {},
  handleError() {}
};

export const createRouteHelperMock: any = {
  incrementCapacity: _ => {},
  decrementCapacity: _ => {},
  validateFormEntries: _ => {},
  createNewRouteRequestObject: _ => {},
  notifyUser: _ => {}
};

export const routerMock: any = {
  navigate: _ => {}
};

export const toastrMock: any = {
  error: _ => {},
  success: _ => {}
};

export const httpMock: any = {
  post: _ => {}
};

export const navMenuServiceMock: any = {
  showProgress: _ => {},
  stopProgress: _ => {}
};
