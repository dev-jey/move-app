import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverEditModalComponent } from './driver-edit-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from '../../../angular-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertService } from '../../../shared/alert.service';
import {of, throwError} from 'rxjs';
import {DriversInventoryService} from '../../__services__/drivers-inventory.service';
import { successMock } from '../../providers/provider-modal/provider-modal.component.spec';
import {AppEventService} from '../../../shared/app-events.service';
import {MockError} from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';

const matDialogMock = {
  open: jest.fn().mockReturnValue({
    componentInstance: {
      executeFunction: {
        subscribe: () => of()
      }
    },
    afterClosed: () => of()
  }),
};
export const mockDriverService = {
  updateDriver: jest.fn()
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
const mockMatDialogData = {
  data: {
    displayText: 'display data',
    confirmText: 'yes'
  }
};
const appEventService = new AppEventService();
describe('DriverEditModalComponent', () => {
  let component: DriverEditModalComponent;
  let form;
  let fixture: ComponentFixture<DriverEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DriverEditModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, HttpClientTestingModule, AngularMaterialModule, BrowserAnimationsModule],
      providers: [{ provide: MatDialog, useValue: matDialogMock },
      { provide: MatDialogRef, useValue: mockMatDialogRef },
      { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
      { provide: AlertService, useValue: alert },
        { provide: AppEventService, useValue: appEventService},
        {provide: DriversInventoryService, useValue: mockDriverService}
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    form = new NgForm([], []);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should close dialog', () => {
    jest.spyOn(component.dialogRef, 'close');
    component.closeDialog();
    expect(component.dialogRef.close).toBeCalled();
  });
  it('should edit driver and give a toast message on success', () => {
    mockDriverService.updateDriver.mockReturnValue(of(successMock));
    jest.spyOn(component.toastService, 'success');
    jest.spyOn(component.dialogRef, 'close');
    jest.spyOn(AppEventService.prototype, 'broadcast');
    component.editDriver(form, null, null);
    expect(mockDriverService.updateDriver).toBeCalled();
    expect(component.toastService.success).toBeCalled();
    expect(component.loading).toBeFalsy();
    expect(component.dialogRef.close).toBeCalled();
    expect(appEventService.broadcast).toBeCalled();
    expect(appEventService.broadcast).toBeCalledWith({name: 'updatedDriversEvent'});
  });
  it('should throw an error of not successfully updated', () => {
    mockDriverService.updateDriver.mockReturnValue(throwError(new MockError(404, 'Driver not found')));
    jest.spyOn(component.toastService, 'error');
    component.editDriver(form, null, null);
    expect(component.loading).toBeFalsy();
    expect(component.toastService.error).toBeCalled();
    expect(component.toastService.error).toBeCalledWith('Driver not found');
  });
});
