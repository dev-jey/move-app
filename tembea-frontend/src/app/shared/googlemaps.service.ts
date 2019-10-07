import { Injectable, ElementRef } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

declare let google: any;

@Injectable()
export class GoogleMapsService {
  geocoder: any;

  constructor(private mapLoader: MapsAPILoader) {}

  initLibraries(element: ElementRef) {
    this.geocoder = new google.maps.Geocoder();
    if (element) {
      return new google.maps.places.Autocomplete(element, { types: ['address'] });
    }
  }

  async loadGoogleMaps(element?: ElementRef) {
    await this.mapLoader.load();
    this.initLibraries(element);
  }

  async getLocationAddressFromCoordinates(coordinates) {
    const response = await this.lookUpAddressOrCoordinates(coordinates, 'location');
    const address = this.retrieveLocationDetails(response, 'address');
    return address;
  }

  async getLocationCoordinatesFromAddress(address) {
    const response = await this.lookUpAddressOrCoordinates(address, 'address');
    const coordinates = this.retrieveLocationDetails(response);
    return coordinates;
  }

  lookUpAddressOrCoordinates(location, lookUpType) {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ [lookUpType]: location }, (response, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          resolve(response[0]);
        } else {
          reject('Location not found');
        }
      });
    });
  }

  retrieveLocationDetails(googleGeocodeResponse, detailType?: string) {
    if (detailType) {
      return googleGeocodeResponse.formatted_address;
    }
    const { lat, lng } = googleGeocodeResponse.geometry.location;
    return { lat: lat(), lng: lng() };
  }
}
