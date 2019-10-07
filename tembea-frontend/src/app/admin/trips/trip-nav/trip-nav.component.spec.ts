import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TripNavComponent } from './trip-nav.component';
import { TripItineraryComponent } from '../trip-itinerary/trip-itinerary.component';
import { ShortenNamePipe } from '../../__pipes__/shorten-name.pipe';
import { AppTestModule } from '../../../__tests__/testing.module';
import { AppEventService } from 'src/app/shared/app-events.service';
import { ShortenTextPipe } from '../../__pipes__/shorten-text.pipe';


describe('TripNavComponent', () => {
  let component: TripNavComponent;
  let fixture: ComponentFixture<TripNavComponent>;
  const appEventsMock = {
    broadcast: jest.fn()
  };
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ TripNavComponent, ShortenNamePipe, TripItineraryComponent, ShortenTextPipe ],
      imports: [HttpClientTestingModule, AppTestModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AppEventService, useValue: appEventsMock }
      ]
    })
    .overrideTemplate(TripNavComponent, `<div></div>`)
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
    const event = {
      tripRequestType: 'pastTrips',
      tab: {
        textLabel: 'Past Trips'
      }
    };
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('should send a past trips broadcast message', () => {
      component.data = { pastTrips: { totalItems: 4 } };
      const broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: component.data.pastTrips.totalItems };
      component.getSelectedTab(event);
      expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
    });
    it('should send a All Trips broadcast message', () => {
      component.data = { all: { totalItems: 4 } };
      event.tab.textLabel = 'All Trips';
      const broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: component.data.all.totalItems };
      component.getSelectedTab(event);
      expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
    });
  it('should send a Declined Trips broadcast message', () => {
    component.data = { declinedTrips: { totalItems: 4 } };
    event.tab.textLabel = 'Declined Trips';
    const broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: component.data.declinedTrips.totalItems };
    component.getSelectedTab(event);
    expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
  });
  it('should send a Upcoming Trips broadcast message', () => {
    component.data = { upcomingTrips: { totalItems: 4 } };
    event.tab.textLabel = 'Upcoming Trips';
    const broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: component.data.upcomingTrips.totalItems };
    component.getSelectedTab(event);
    expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
  });
  it('should send an Awaiting Provider message', () => {
    component.data = { awaitingProvider : { totalItems: 4 } };
    event.tab.textLabel = 'Awaiting Provider';
    const broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: component.data.awaitingProvider.totalItems };
    component.getSelectedTab(event);
    expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
  });
  it('should send a default all broadcast message if event not found', () => {
    component.data = { all: { totalItems: 4 } };
    event.tab.textLabel = 'mmmm';
    const broadcastPayload = { tooltipTitle: event.tab.textLabel, badgeSize: component.data.all.totalItems };
    component.getSelectedTab(event);
    expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
  });
  it('should call tripsTotal function', () => {
    component.tripsTotal(event);
    expect(component.data['pastTrips'].tripRequestType).toEqual(event.tripRequestType);
  });
});
