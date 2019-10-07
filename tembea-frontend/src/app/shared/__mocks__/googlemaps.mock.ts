export const mapsAPILoaderMock: any = {
  load: _ => Promise.resolve({}),
};

export const mockWindowObject = () => {
  window['google'] = {
    maps: {
      Geocoder: class Geocoder {},
      places: {
        Autocomplete: class Autocomplete {}
      }
    }
  };
};

export const mockCoordinates = { lat: -1.87637, lng: 36.89373 };
export const mockAddress = '5, alien road, Pluto Ticket Point, Jupitar.';
export const mockResponse = {
  formatted_address: mockAddress,
  geometry: {
    location: {
      lat: () => mockCoordinates.lat,
      lng: () => mockCoordinates.lng
    }
  }
};
