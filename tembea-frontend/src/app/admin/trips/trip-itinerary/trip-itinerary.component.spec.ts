import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatDialog } from '@angular/material';

import { TripItineraryComponent } from './trip-itinerary.component';
import { ShortenNamePipe } from '../../__pipes__/shorten-name.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { TripRequestService } from '../../__services__/trip-request.service';
import { tripRequestMock } from '../../../shared/__mocks__/trip-request.mock';
import { department } from '../../../shared/__mocks__/department.mock';
import { AppTestModule } from '../../../__tests__/testing.module';
import { AppEventService } from '../../../shared/app-events.service';
import { ShortenTextPipe } from '../../__pipes__/shorten-text.pipe';

const mockMatDialog = {
  open: jest.fn(),
};

describe('TripItineraryComponent', () => {
  const appEventsMock = {
    broadcast: jest.fn()
  };
  let component: TripItineraryComponent;
  let tripRequestService: TripRequestService;
  let fixture: ComponentFixture<TripItineraryComponent>;
  const tripInfo = {
    distance: '12 km',
    requester: {
      name: 'sdfe'
    },
    rider: {
      name: 'sfdddsa'
    },
    pickup: 'asd',
    destination: 'afsd',
    department: 'safd'
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TripItineraryComponent, ShortenNamePipe, EmptyPageComponent, ShortenTextPipe],
      imports: [HttpClientTestingModule, AppTestModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MatDialog, useValue: mockMatDialog
        },
        { provide: AppEventService, useValue: appEventsMock },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripItineraryComponent);
    component = fixture.componentInstance;
    tripRequestService = fixture.debugElement.injector.get(TripRequestService);
    component.tripRequestType = 'all';
    fixture.detectChanges();
  });

  beforeEach(() => {
    const trips = Object.assign({}, tripRequestMock);
    const pageInfo = {
      totalResults: 12,
    };
    jest.spyOn(tripRequestService, 'getDepartments').mockReturnValue(of(department));
    jest.spyOn(tripRequestService, 'query')
      .mockReturnValue(of({ trips: [trips], pageInfo }));
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create TripItineraryComponent', () => {
    expect(component).toBeTruthy();
  });


  describe('ngOnInit', () => {
    it('should get trips and department', () => {
      component.tripRequestType = 'all';
      component.ngOnInit();
      expect(tripRequestService.query).toHaveBeenCalled();
      expect(tripRequestService.getDepartments).toHaveBeenCalled();
      expect(component.status).toEqual(null);
    });
    it('should broadcast an event in all', () => {
      component.tripRequestType = 'all';
      component.ngOnInit();
      expect(appEventsMock.broadcast).toHaveBeenCalledWith({
        name: 'updateHeaderTitle',
        content: { 'badgeSize': 12, 'tooltipTitle': 'All Trips' }
      });

    });
  });

  describe('declinedTrips', () => {
    it('should get declinedTrips and department', () => {
      component.tripRequestType = 'declinedTrips';
      component.ngOnInit();
      expect(tripRequestService.query).toHaveBeenCalled();
      expect(tripRequestService.getDepartments).toHaveBeenCalled();
    });
  });

  describe('pastTrips', () => {
    it('should get pastTrips and department', () => {
      component.tripRequestType = 'pastTrips';
      component.ngOnInit();
      expect(tripRequestService.query).toHaveBeenCalled();
      expect(tripRequestService.getDepartments).toHaveBeenCalled();
    });
  });

  describe('updatePage', () => {
    it('should get trips and department', () => {
      jest.spyOn(component, 'getTrips');

      const page = 3;
      component.updatePage(page);

      expect(component.getTrips).toHaveBeenCalled();
    });
  });

  describe('setDateFilter', () => {
    it('should set date filters and call getTrips()', () => {
      const getTripsSpy = jest.spyOn(component, 'getTrips')
        .mockImplementation(jest.fn());

      component.setDateFilter('requestedOn', 'before', '2019-03-03');

      expect(getTripsSpy).toBeCalledTimes(1);
      expect(component.dateFilters.requestedOn).toEqual({ before: '2019-03-03' });
    });

    it('should return empty date if date is lower than current date', () => {
      component.tripRequestType = 'upcomingTrips';
      const getTripsSpy = jest.spyOn(component, 'getTrips')
        .mockImplementation(jest.fn());
      component.setDateFilter('requestedOn', 'before', '2018-03-03');

      expect(getTripsSpy).toBeCalledTimes(1);
      expect(component.dateFilters.requestedOn).toEqual({});
    });
  });

  describe('setFilterParams', () => {
    it('should set filter parameters for exporting tables', () => {
      component.departmentName = 'routes';
      component.dateFilters = {
        requestedOn: '2022-12-21',
        departureTime: '2023-12-21'
      };

      component.setFilterParams();

      expect(component.filterParams).toEqual({
        department: 'routes',
        dateFilters: {
          requestedOn: '2022-12-21', departureTime: '2023-12-21'
        }
      });
    });
  });

  describe('checkTripRequestType', () => {
    it('should check trip\'s request type', () => {
      component.tripRequestType = 'declinedTrips';

      const isDeclinedTrips = component.checkTripRequestType('declinedTrips');
      expect(isDeclinedTrips).toBe(true);
    });
  });

  describe('departmentSelected', () => {
    it('fires event when department is selected', () => {
      const getTripsSpy = jest.spyOn(component, 'getTrips');
      component.departmentSelected('(click)');
      expect(component.departmentName).toEqual('(click)');
      expect(getTripsSpy).toHaveBeenCalled();
    });
  });

  describe('Up Coming Trips', () => {
    it('should get upcomingTrips and department', () => {
      component.tripRequestType = 'upcomingTrips';
      component.ngOnInit();
      expect(tripRequestService.query).toHaveBeenCalled();
      expect(tripRequestService.getDepartments).toHaveBeenCalled();
    });
  });
  describe('view Trip Description', () => {
    it('should show decription of a trip when clicked', () => {
      component.viewTripDescription(tripInfo);
      expect(mockMatDialog.open).toBeCalledTimes(1);
    });
  });
  describe('Awaiting Provider drivers and cabs Trips', () => {
    it('should get trips awaiting provider drivers and cabs', () => {
      component.tripRequestType = 'awaitingProvider';
      component.ngOnInit();
      expect(tripRequestService.query).toHaveBeenCalled();
    });
  });
});
