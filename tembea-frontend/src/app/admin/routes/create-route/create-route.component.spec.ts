import { CreateRouteComponent } from './create-route.component';
import { CreateRouteHelper } from './create-route.helper';
import { takeOffTimeFormat } from './createRouteUtils';
import {
  googleMapsServiceMock, routeServiceMock, createRouteHelperMock, routerMock, toastrMock
  , navMenuServiceMock
} from '../__mocks__/create-route';

const mockCoordinates = { lat: -1.87637, lng: 36.89373 };
const mockAddress = '5, alien road, Pluto Ticket Point, Jupitar.';

describe('CreateRouteComponent', () => {
  let component: CreateRouteComponent;

  beforeEach(() => {
    component = new CreateRouteComponent(
      googleMapsServiceMock,
      routeServiceMock,
      createRouteHelperMock,
      routerMock,
      navMenuServiceMock
    );
    component.destinationInputElement = { nativeElement: { value: 'someValue' } };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load google maps', () => {
    const loadGoogleMaps = jest.spyOn(component.googleMapsService, 'loadGoogleMaps');
    component.ngAfterViewInit();
    expect(loadGoogleMaps).toHaveBeenCalled();
  });

  it('should show route on map when executed', async () => {
    const updateRoute = jest.spyOn(component, 'updateRouteDisplay');
    const getCoordinates = jest.spyOn(component.googleMapsService,
      'getLocationCoordinatesFromAddress');

    await component.showRouteDirectionOnClick();
    expect(getCoordinates).toHaveBeenCalled();
    expect(updateRoute).toHaveBeenCalled();
  });

  it('should throw an error if location does not exist', async () => {
    const updateRoute = jest.spyOn(component, 'updateRouteDisplay');
    const getCoordinates = jest.spyOn(component.googleMapsService,
      'getLocationCoordinatesFromAddress').mockRejectedValue('Location not found');
    const notifyUser = jest.spyOn(component.createRouteHelper, 'notifyUser');

    await component.showRouteDirectionOnClick();
    expect(notifyUser).toHaveBeenCalledWith(['Location not found']);
  });

  it('should update Destination form Field with coordinates address when the map marker is dragged', async () => {
    const updateRoute = jest.spyOn(component, 'updateRouteDisplay');
    const getAddress = jest.spyOn(component.googleMapsService,
      'getLocationAddressFromCoordinates').mockReturnValue(Promise.resolve(mockAddress));

    await component.updateDestinationFieldOnMarkerDrag('Marker', mockCoordinates);

    expect(getAddress).toHaveBeenCalled();
    expect(component.model.destinationInputField).toEqual(mockAddress);
    expect(updateRoute).toHaveBeenCalled();
  });

  it('should clear destination coordinates when user changes the destination input field', () => {
    component.destinationCoordinates = mockCoordinates;
    component.clearDestinationCoordinates();

    expect(component.destinationCoordinates).toBe(null);
  });

  it('should update coordinate variables to display route on map', () => {
    const toggleMapDisplay = jest.spyOn(component, 'toggleMapDisplay');

    component.updateRouteDisplay(mockCoordinates);
    const { destination, destinationCoordinates } = component;

    expect(destination).toEqual(mockCoordinates);
    expect(destinationCoordinates).toEqual(mockCoordinates);
    expect(toggleMapDisplay).toHaveBeenCalled();
  });

  it('should toggle maps display', () => {
    expect(component.toggleMapDisplay()).toBeUndefined();
  });

  it('should call method to increment or decrement value supplied', () => {
    const incrementer = jest.spyOn(component.createRouteHelper, 'incrementCapacity');
    const decrementer = jest.spyOn(component.createRouteHelper, 'decrementCapacity').mockReturnValue(2);

    component.changeCapacityValue('incrementCapacity');
    component.changeCapacityValue('decrementCapacity');

    expect(incrementer).toHaveBeenCalled();
    expect(decrementer).toHaveBeenCalled();
    expect(component.model.capacity).toEqual(2);
  });

  it('should display an error message if destination coordinates are not set.', () => {
    component.destinationCoordinates = undefined;
    const notifyUser = jest.spyOn(component.createRouteHelper, 'notifyUser');

    component.createRoute('formValues');

    expect(notifyUser).toHaveBeenCalled();
  });

  it('should display error messages if submitted form contains errors', () => {
    component.destinationCoordinates = mockCoordinates;
    const notifyUser = jest.spyOn(component.createRouteHelper, 'notifyUser');
    const createObj = jest.spyOn(component.createRouteHelper, 'createNewRouteRequestObject')
      .mockReturnValue({});
    const validator = jest.spyOn(component.createRouteHelper, 'validateFormEntries')
        .mockReturnValue(['fail validation', 'another failed validation']);

    component.createRoute();

    expect(notifyUser).toHaveBeenCalled();
    expect(createObj).toHaveBeenCalled();
    expect(validator).toHaveBeenCalled();
  });

  it('should send validated data to the server', async () => {
    component.destinationCoordinates = mockCoordinates;
    const formValues = { someProp: 'someValue' };

    const sendRequestToServer = jest.spyOn(component, 'sendRequestToServer').mockResolvedValue(Promise.resolve());
    const validator = jest.spyOn(component.createRouteHelper, 'validateFormEntries')
      .mockReturnValue([]);
    const createObj = jest.spyOn(component.createRouteHelper, 'createNewRouteRequestObject')
      .mockReturnValue(formValues);

    await component.createRoute();

    expect(createObj).toHaveBeenCalled();
    expect(validator).toHaveBeenCalled();
    expect(sendRequestToServer).toHaveBeenCalledWith(formValues);
  });

  it('should display a success message if post request is successful', async () => {
    const response = { message: 'Route created successfully'};

    const notifyUser = jest.spyOn(component.createRouteHelper, 'notifyUser');
    const navigate = jest.spyOn(component.router, 'navigate');
    const routeService = jest.spyOn(component.routeService, 'createRoute')
        .mockResolvedValue(response);

    await component.sendRequestToServer('formValues');

    expect(routeService).toHaveBeenCalledWith('formValues');
    expect(notifyUser).toHaveBeenCalledWith([response.message], 'success');
    expect(navigate).toHaveBeenCalled();
  });

  it('should display an error message if post request is unsuccessful', async () => {
    const response = { error: { message: 'some server error' } };

    const notifyUser = jest.spyOn(component.createRouteHelper, 'notifyUser');
    const routeService = jest.spyOn(component.routeService, 'createRoute')
        .mockRejectedValue(response);

    await component.sendRequestToServer('formValues');

    expect(routeService).toHaveBeenCalledWith('formValues');
    expect(notifyUser).toHaveBeenCalledWith([response.error.message]);
  });

  it('should display a generic error message if post request is unsuccessful', async () => {
    const response = { error: { someOtherError: 'some server error' } };

    const notifyUser = jest.spyOn(component.createRouteHelper, 'notifyUser');
    const routeService = jest.spyOn(component.routeService, 'createRoute')
        .mockRejectedValue(response);

    await component.sendRequestToServer('formValues');

    expect(routeService).toHaveBeenCalledWith('formValues');
    expect(notifyUser).toHaveBeenCalledWith(['An error occurred.']);
  });
});

describe('CreateRoute Helper Component', () => {
  let component: CreateRouteHelper;

  beforeEach(() => {
    component = new CreateRouteHelper(toastrMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment a number value', () => {
    const newValue = component.incrementCapacity(1);
    expect(newValue).toBe(2);
  });

  it('should decrement a number value', () => {
    const newValue = component.decrementCapacity(2);
    expect(newValue).toBe(1);
  });

  it('should return 1 if value passed is less than 2', () => {
    const newValue = component.decrementCapacity(0);
    expect(newValue).toBe(1);
  });

  it('should add destination property with nested address and coordinate props', () => {
    const formValues = { fieldOne: 'valueOne', fieldTwo: 'valueTwo' };
    const newObject = {
      ...formValues,
      destination: { address: mockAddress, coordinates: mockCoordinates }
    };
    const finalObject = component.createNewRouteRequestObject(formValues, mockAddress, mockCoordinates);
    expect(`${finalObject}`).toEqual(`${newObject}`);
  });

  it('should return an error of errors if errors exists', () => {
    const formValues = { takeOffTime: 'valueOne', capacity: 'valueTwo' };
    const inputValidator = jest.spyOn(component, 'validateInputFormat')
      .mockReturnValue(['error made']);
    const capacityValidator = jest.spyOn(component, 'validateCapacity')
      .mockReturnValue(['error made again']);

    const errors = component.validateFormEntries(formValues);
    expect(inputValidator).toHaveBeenCalled();
    expect(capacityValidator).toHaveBeenCalled();
    expect(errors).toHaveLength(2);
  });

  it('should add destination property with nested address and coordinate props', () => {
    const formValues = { takeOffTime: 'valueOne', capacity: 'valueTwo' };
    const inputValidator = jest.spyOn(component, 'validateInputFormat')
      .mockReturnValue(['error made']);
    const capacityValidator = jest.spyOn(component, 'validateCapacity')
      .mockReturnValue(['error made again']);

    const errors = component.validateFormEntries(formValues);
    expect(inputValidator).toHaveBeenCalled();
    expect(capacityValidator).toHaveBeenCalled();
    expect(errors).toHaveLength(2);
  });

  it('should fail if field is invalid', () => {
    const errors = component.validateInputFormat('23:0', takeOffTimeFormat, 'Take-off Time');
    expect(errors[0]).toEqual('Take-off Time is invalid');
  });

  it('should return an empty string if field is valid', () => {
    const errors = component.validateInputFormat('23:00', takeOffTimeFormat, 'Take-off Time');
    expect(errors).toHaveLength(0);
  });

  it('should fail if value is not an integer or less than 1', () => {
    const errors = component.validateCapacity('-1', 'Capacity');
    expect(errors[0]).toEqual('Capacity must be an integer greater than zero');
  });

  it('should return an empty array if value is valid', () => {
    const errors = component.validateCapacity('5', 'Capacity');
    expect(errors).toHaveLength(0);
  });

  it('should display all messages in the array it recieves', () => {
    const toastrError = jest.spyOn(component.toastr, 'error');
    const toastrSuccess = jest.spyOn(component.toastr, 'success');

    const errorMessages = [
      'errorOne', 'errorTwo', 'errorThree', 'errorFour', 'errorFive'
    ];

    const errors = component.notifyUser(errorMessages);
    const success = component.notifyUser([errorMessages[0]], 'success');

    expect(toastrError).toHaveBeenCalledTimes(errorMessages.length);
    expect(toastrSuccess).toHaveBeenCalledTimes(1);
  });
});
