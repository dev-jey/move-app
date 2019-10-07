import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FellowRoutesResponseMock, FellowProcessedDataMock, FellowErrorDataMock } from './__mocks__/get-routes-response.mock';
import { of } from 'rxjs';

import { FellowComponent } from './fellow.component';
import { FellowRouteService } from '../../../__services__/fellow-route.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('FellowComponent', () => {
  let component: FellowComponent;
  let fixture: ComponentFixture<FellowComponent>;

  const FellowRoutesMock = {
    getFellowRoutes: () => of(FellowRoutesResponseMock),
    userDetails: () => of(FellowRoutesResponseMock),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FellowComponent ],
      imports: [HttpClientTestingModule, AngularMaterialModule,
        BrowserAnimationsModule, RouterTestingModule.withRoutes([])],
      providers: [
        {provide: FellowRouteService, useValue: FellowRoutesMock}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FellowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    jest.spyOn(FellowRoutesMock, 'getFellowRoutes');
  }));

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create component and render fellows', async(() => {
    component.getFellowsRoutes();
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);

    expect(component.fellowsData).toEqual(FellowProcessedDataMock.data);
  }));

  describe('setPage', () => {
    it('should reload page', (() => {
      jest.spyOn(component, 'getFellowsRoutes');
      expect(component.pageNo).toEqual(1);

      component.setPage(20);
      fixture.detectChanges();
      expect(component.pageNo).toEqual(20);
      expect(component.getFellowsRoutes).toHaveBeenCalled();
    }));
  });

  it('Should return user name data', () => {
    component.userDetails(FellowRoutesResponseMock);
    expect(component.userName).toEqual('');
  });
});

describe('FellowComponent not array returned', () => {
  let component: FellowComponent;
  let fixture: ComponentFixture<FellowComponent>;

  const FellowRoutesMock = {
    getFellowRoutes: () => of(FellowErrorDataMock)
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FellowComponent ],
      imports: [HttpClientTestingModule, AngularMaterialModule,
        BrowserAnimationsModule, RouterTestingModule.withRoutes([])],
      providers: [
        {provide: FellowRouteService, useValue: FellowRoutesMock}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FellowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    jest.spyOn(FellowRoutesMock, 'getFellowRoutes');
  }));

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });


  it('Should return user name data', () => {
    component.getFellowsRoutes();
    expect(component.isLoading).toEqual(false);
    expect(component.displayText).toEqual('Something went wrong');
  });
});
