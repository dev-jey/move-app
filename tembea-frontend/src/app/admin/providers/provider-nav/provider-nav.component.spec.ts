import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderNavComponent } from './provider-nav.component';
import {AppEventService} from '../../../shared/app-events.service';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ActivatedRoute } from '@angular/router';


const ActivatedRouteMock = {
  params: {subscribe: jest.fn() }
};
describe('ProviderNavComponent', () => {
  let component: ProviderNavComponent;
  let fixture: ComponentFixture<ProviderNavComponent>;
  const appEventService = new AppEventService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderNavComponent ],
      providers: [
        { provide : ActivatedRoute, useValue: ActivatedRouteMock },
        { provide: AppEventService, useValue: appEventService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tabChanged', () => {
    it('should change to Drivers tab on click', () => {
      const expected = {
        'name': 'updateHeaderTitle',
        'content': {
          'actionButton': 'Add Driver',
          'headerTitle': 'Andela Kenya Drivers',
          'badgeSize': 5
        }
      };
      const event = {tab: { textLabel: 'Drivers' } };
      jest.spyOn(appEventService, 'broadcast');

      component.data = {
        providerDrivers: {
          providerName: 'Andela Kenya',
          totalItems: 5
        }
      };

      component.tabChanged(event);
      expect(appEventService.broadcast).toHaveBeenCalledWith(expected);

    });
    it('should change to Vehicles tab on click', () => {
      const expected = {
        'name': 'updateHeaderTitle',
        'content': {
          'actionButton': 'Add a New Vehicle',
          'badgeSize': 10,
          'headerTitle': 'Andela Kenya Vehicles',
        }
      };
      const event = { tab: { textLabel: 'Vehicles' } };
      jest.spyOn(appEventService, 'broadcast');

      component.data = {
        providerVehicles: {
          providerName: 'Andela Kenya',
          totalItems: 10
        }
      };
      component.tabChanged(event);
      expect(appEventService.broadcast).toHaveBeenCalledWith(expected);

    });

  });
});
