import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import data from './__mocks__/drivers-data.mock';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from '../../../angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DriverInventoryComponent } from './driver-inventory.component';
import { DriversInventoryService } from '../../__services__/drivers-inventory.service';
import getDriversResponseMock from '../../../__mocks__/drivers.mock';
import {BaseInventoryComponent} from '../../base-inventory/base-inventory.component';
import {AppEventService} from '../../../shared/app-events.service';


const appEventService = new AppEventService();
describe('DriverInventoryComponent', () => {
  let component: DriverInventoryComponent;
  let fixture: ComponentFixture<DriverInventoryComponent>;

  const driversInventoryMock = {
    getDrivers: () => of(getDriversResponseMock),
  };

  const activatedRouteMock = {
    params: {subscribe: jest.fn() }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverInventoryComponent ],
      providers: [
        DriversInventoryService,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AppEventService, useValue: appEventService }
      ],
      imports: [HttpClientTestingModule, AngularMaterialModule, BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check for current card with open options menu', () => {
    component.currentOptions = 1;
    component.showOptions(1);
    expect(component.currentOptions).toBe(-1);
  });

  describe('ngOnInit', () => {
    it('should update and load page', (() => {

      component.ngOnInit();
      fixture.detectChanges();
      expect(component.drivers).toEqual([]);
    }));
    it('should subscribe to events ', ( () => {
      jest.spyOn(BaseInventoryComponent.prototype, 'updateInventory');
      jest.spyOn(appEventService, 'subscribe');
      component.ngOnInit();
      expect(appEventService.subscribe).toBeCalled();
    }));
    it('should call getInventory when there is a new driver ', ( () => {
      jest.spyOn(BaseInventoryComponent.prototype, 'getInventory');
      const event  = {
        name: 'newDriver',
        content: {}
      };
      component.ngOnInit();
      appEventService.broadcast(event);
      expect(BaseInventoryComponent.prototype.getInventory).toBeCalled();
    }));
  });

  describe('setPage', () => {
    it('should update and load page', (() => {
      jest.spyOn(DriversInventoryService.prototype, 'get').mockReturnValue(of(data));
      component.loadData(2, 1, 'name', 1);
      expect(DriversInventoryService.prototype.get).toHaveBeenCalled();
      expect(component.totalItems).toEqual(12);
    }));
  });
});
