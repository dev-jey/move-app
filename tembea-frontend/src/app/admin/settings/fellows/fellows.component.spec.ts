import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { FellowsComponent } from './fellows.component';
import { FellowsService } from '../../__services__/fellows.service';
import { FellowCardComponent } from './fellow-card/fellow-card.component';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { of } from 'rxjs';
import { fellowsMockResponse, fellowsArrayMockResponse } from '../../__services__/__mocks__/fellows.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { componentFactoryName } from '@angular/compiler';

describe('FellowsComponent', () => {
  let component: FellowsComponent;
  let fixture: ComponentFixture<FellowsComponent>;
  let fellowService: FellowsService;
  const mockFellowsService = {
    getFellows: jest.fn().mockReturnValue(of(fellowsMockResponse))
  };

  const matDialogMock = {
    open: jest.fn().mockReturnValue({
      componentInstance: {
        removeUser: {
          subscribe: () => jest.fn()
        }}
       })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FellowsComponent,
        FellowCardComponent,
        AppPaginationComponent,
        EmptyPageComponent
      ],
      imports: [ RouterTestingModule.withRoutes([])],
      providers: [
        { provide: FellowsService, useValue: mockFellowsService },
        { provide: MatDialog, useValue: matDialogMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FellowsComponent);
    component = fixture.componentInstance;
    fellowService = fixture.debugElement.injector.get(FellowsService);
    fixture.detectChanges();
  });

  it('should create fellows component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch fellows when component instantiates', () => {
    expect(mockFellowsService.getFellows).toHaveBeenCalled();
  });

  it('should get next page when pagination is clicked', () => {
    component.setPage(2);
    expect(mockFellowsService.getFellows).toHaveBeenCalledWith(true, 9, 2);
  });


  describe('ngOnInit', () => {
    it('should get fellows onRoute', () => {
      component.onOrOffRoute = 'onRoute';
      component.ngOnInit();
      expect(fellowService.getFellows).toHaveBeenCalled();
    });

    it('shold get fellows offRoute', () => {
      component.onOrOffRoute = 'offRoute';
      component.ngOnInit();
      expect(fellowService.getFellows).toHaveBeenCalled();
    });
  });
});


describe('FellowsComponent no fellow Array', () => {
  let component: FellowsComponent;
  let fixture: ComponentFixture<FellowsComponent>;
  const mockFellowsService = {
    getFellows: jest.fn().mockReturnValue(of(fellowsArrayMockResponse))
  };

  const matDialogMock = {
    open: jest.fn().mockReturnValue({
      componentInstance: {
        removeUser: {
          subscribe: () => jest.fn()
        }}
       })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FellowsComponent,
        FellowCardComponent,
        AppPaginationComponent,
        EmptyPageComponent
      ],
      imports: [ RouterTestingModule.withRoutes([])],
      providers: [
        { provide: FellowsService, useValue: mockFellowsService },
        { provide: MatDialog, useValue: matDialogMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FellowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should fetch fellows when component instantiates', () => {
    expect(mockFellowsService.getFellows).toHaveBeenCalled();
    expect(component.isLoading).toEqual(false);
    expect(component.displayText).toEqual('Something went wrong');
  });

});
