import { ElementRef } from '@angular/core';
import { GoogleMapsService } from './googlemaps.service';
import {
  mapsAPILoaderMock, mockWindowObject, mockAddress, mockCoordinates, mockResponse
} from './__mocks__/googlemaps.mock';

describe('CreateRouteComponent', () => {
  let component: GoogleMapsService;
  let element: ElementRef;

  beforeEach(() => {
    component = new GoogleMapsService(mapsAPILoaderMock);
    mockWindowObject();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize googlemaps', () => {
    const geocoder = jest.spyOn(window.google.maps, 'Geocoder');
    const autocomplete = jest.spyOn(window.google.maps.places, 'Autocomplete');
    element = '<input />';
    component.initLibraries(element);

    expect(geocoder).toHaveBeenCalled();
    expect(autocomplete).toHaveBeenCalledWith(element, { types: ['address'] });
  });

  it('should load googlemaps', async () => {
    const initLibraries = jest.spyOn(component, 'initLibraries');
    const load = jest.spyOn(component.mapLoader, 'load');

    await component.loadGoogleMaps(element);

    expect(load).toHaveBeenCalled();
    expect(initLibraries).toHaveBeenCalledWith(element);
  });

  it('should get location address from given coordinates', async () => {
    const locationLookup = jest.spyOn(component, 'lookUpAddressOrCoordinates')
      .mockReturnValue(mockResponse);
    const retriever = jest.spyOn(component, 'retrieveLocationDetails')
      .mockReturnValue(mockResponse.formatted_address);

    const address = await component.getLocationAddressFromCoordinates(mockCoordinates);

    expect(locationLookup).toHaveBeenCalledWith(mockCoordinates, 'location');
    expect(retriever).toHaveBeenCalledWith(mockResponse, 'address');
    expect(address).toEqual(mockAddress);
  });

  it('should get location coordinates address from given address', async () => {
    const locationLookup = jest.spyOn(component, 'lookUpAddressOrCoordinates')
      .mockReturnValue(mockResponse);
    const retriever = jest.spyOn(component, 'retrieveLocationDetails')
      .mockReturnValue(mockCoordinates);

    const coordinates = await component.getLocationCoordinatesFromAddress(mockCoordinates);

    expect(locationLookup).toHaveBeenCalledWith(mockCoordinates, 'address');
    expect(retriever).toHaveBeenCalledWith(mockResponse);
    expect(coordinates).toEqual(mockCoordinates);
  });

  it('should retrieve coordinates from response', () => {
    const coordinates = component.retrieveLocationDetails(mockResponse);
    expect(coordinates).toEqual(mockCoordinates);
  });

  it('should retrieve address from response', () => {
    const address = component.retrieveLocationDetails(mockResponse, 'address');
    expect(address).toEqual(mockAddress);
  });
});
