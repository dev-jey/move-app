import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { data } from './__mocks__/get-routes-response.mock';
import { of} from 'rxjs';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CabInventoryComponent } from './cab-inventory.component';
import { CabsInventoryService } from '../../__services__/cabs-inventory.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { AppEventService } from '../../../shared/app-events.service';
import {BaseInventoryComponent} from '../../base-inventory/base-inventory.component';


const appEventService = new AppEventService();
describe('CabInventoryComponent', () => {
  let component: CabInventoryComponent;
  let fixture: ComponentFixture<CabInventoryComponent>;

  const activatedRouteMock = {
    params: {subscribe: jest.fn() }
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CabInventoryComponent
      ],
      providers: [
        CabsInventoryService,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AppEventService, useValue: appEventService }
      ],
      imports: [HttpClientTestingModule, AngularMaterialModule, BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CabInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create component and render cabs', async(() => {
    expect(component).toBeTruthy();
  }));

  describe('ngOnInit', () => {
    it('should update and load page', (() => {

      component.ngOnInit();
      fixture.detectChanges();
      expect(component.cabs).toEqual([]);
    }));
    it('should subscribe to events ', ( () => {
      jest.spyOn(BaseInventoryComponent.prototype, 'getInventory');
      jest.spyOn(appEventService, 'subscribe');
      component.ngOnInit();
      expect(appEventService.subscribe).toBeCalled();
    }));
    it('should call getInventory when there is a new cab ', ( () => {
      jest.spyOn(BaseInventoryComponent.prototype, 'getInventory');
      const event  = {
        name: 'newCab',
        content: {}
      };
      component.ngOnInit();
      appEventService.broadcast(event);
      expect(BaseInventoryComponent.prototype.getInventory).toBeCalled();
    }));
    it('should call getInventory when a cab is updated', ( () => {
      jest.spyOn(BaseInventoryComponent.prototype, 'getInventory');
      const event  = {
        name: 'updateCab',
        content: {}
      };
      component.ngOnInit();
      appEventService.broadcast(event);
      expect(BaseInventoryComponent.prototype.getInventory).toBeCalled();
    }));
  });

  describe('setPage', () => {
    it('should update and load page', (() => {
      jest.spyOn(CabsInventoryService.prototype, 'get').mockReturnValue(of(data));
      jest.spyOn(BaseInventoryComponent.prototype, 'emitData');
      component.loadData(2, 1, 'name', 1);
      expect(CabsInventoryService.prototype.get).toHaveBeenCalled();
      expect(component.totalItems).toEqual(12);
      expect(BaseInventoryComponent.prototype.emitData).toHaveBeenCalled();
    }));
  });
});
