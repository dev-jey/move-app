import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { RoutesInventoryEditModalComponent } from './routes-inventory-edit-modal.component';
import { RoutesInventoryService } from 'src/app/admin/__services__/routes-inventory.service';
import { editMockPayload } from '../__mocks__/route-inventory.mock';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { of, Observable } from 'rxjs';
import { AlertService } from 'src/app/shared/alert.service';

describe('RoutesInventoryEditModalComponent', () => {
  let component: RoutesInventoryEditModalComponent;
  let fixture: ComponentFixture<RoutesInventoryEditModalComponent>;
  const mockRouteInventoryService = {
    changeRouteStatus: jest.fn()
  };

  const mockMatDialogRef = {
    close: () => {},
  };

  const alert = {
    success: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn()
  };

  let data;

  const mockMatDialogData = {
    data: {
      name: 'Ngong',
      takeOff: '23:00',
      regNumber: 'KAY 001W',
      capacity: 15,
      batch: 'A',
      inUse: 5,
      status: 'Active'
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutesInventoryEditModalComponent ],
      imports: [FormsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: RoutesInventoryService, useValue: mockRouteInventoryService },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
        { provide: AlertService, useValue: alert }
      ]
    })

    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesInventoryEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    data = {
      id: 1
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

describe('initial load', () => {
  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

describe('closedialog', () => {
  it('should close the dialog', () => {
    jest.spyOn(component.dialogRef, 'close');
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
  });
});

describe('editRoute', () => {

  it('should call changeRouteStatus', () => {
    mockRouteInventoryService.changeRouteStatus.mockReturnValue(of(editMockPayload));
    component.editRoute(editMockPayload);
    expect(component.routeService.changeRouteStatus).toHaveBeenCalledTimes(1);
  });

  it('should call AlertService.success upon successfull edit', () => {
    mockRouteInventoryService.changeRouteStatus.mockReturnValue(of(editMockPayload));
    jest.spyOn(component.alert, 'success');
    component.editRoute(data);
    expect(component.alert.success).toHaveBeenCalledTimes(1);
  });

  it('should call AlertService.error upon unsuccessfull edit', () => {
    const mockError = Observable.create(observer => observer.error(new Error('Not working')));
    mockRouteInventoryService.changeRouteStatus.mockReturnValue(mockError);
    jest.spyOn(component.alert, 'error');
    component.editRoute(data);
    expect(component.alert.error).toHaveBeenCalledTimes(1);
  });
});
});
