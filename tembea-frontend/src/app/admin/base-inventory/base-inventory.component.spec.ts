import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { EventEmitter } from '@angular/core';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppEventService } from 'src/app/shared/app-events.service';
import { ActivatedRoute } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseInventoryComponent } from './base-inventory.component';

const appEventService = new AppEventService();
describe('BaseInventoryComponent', () => {
  let component: BaseInventoryComponent;
  let fixture: ComponentFixture<BaseInventoryComponent>;

  beforeEach(async(() => {
    const activatedRouteMock = {
      params: {subscribe: jest.fn() }
    };
    TestBed.configureTestingModule({
      declarations: [ BaseInventoryComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AppEventService, useValue: appEventService }
      ],
      imports: [HttpClientTestingModule, AngularMaterialModule, BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test getInventory method', () => {
    jest.spyOn(component, 'loadData').mockImplementation();
    component.getInventory();
    expect(component.pageNo).toEqual(1);
    expect(component.isLoading).toEqual(false);
  });

  it('should test updateInventory method', () => {
    const providerInfo = { providerName: test, providerId: 1 };
    jest.spyOn(component, 'loadData').mockImplementation();
    component.updateInventory(providerInfo);
    expect(component.loadData).toHaveBeenCalled();
  });

  it('should test loadData method', () => {
    expect(component.loadData).toThrowError('Not implemented');
  });

  it('should update and load page', () => {
    jest.spyOn(component, 'getInventory');
    jest.spyOn(component, 'loadData').mockImplementation();
    expect(component.pageNo).toEqual(1);

    component.setPage(20);
    fixture.detectChanges();
    expect(component.pageNo).toEqual(20);
    expect(component.getInventory).toHaveBeenCalled();
  });

  it('should test ShowOptions Method', () => {
    component.showOptions(-1);
    expect(component.currentOptions).toEqual(-1);

    component.showOptions(1);
    expect(component.currentOptions).toEqual(1);
  });

  it('should test emitData function', () => {
    const cabEmitter = new EventEmitter;
    const spy = jest.spyOn(EventEmitter.prototype, 'emit');
    component.emitData((cabEmitter));
    expect(spy).toHaveBeenCalled();
  });
});

