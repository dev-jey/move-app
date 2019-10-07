import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverModalComponent } from './driver-modal.component';
import {FormsModule, NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { AlertService } from '../../../shared/alert.service';
import { ProviderService } from '../../__services__/providers.service';
import { AppEventService } from '../../../shared/app-events.service';
import {
  mockMatDialogRef,
  mockProviderService,
  successMock,
  toastService
} from '../provider-modal/provider-modal.component.spec';
import {of, throwError} from 'rxjs';
import {MockError} from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';

const appEventService = new AppEventService();
describe('DriverModalComponent', () => {
  let component: DriverModalComponent;
  let fixture: ComponentFixture<DriverModalComponent>;
  let form;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverModalComponent ],
      imports: [FormsModule],
      providers: [{provide: MatDialogRef, useValue: mockMatDialogRef},
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: AlertService, useValue: toastService },
        { provide: ProviderService, useValue: mockProviderService },
        { provide: AppEventService, useValue: appEventService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    form = new NgForm([], []);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should close the add driver modal', () => {
    jest.spyOn(component.dialogRef, 'close');
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should close the add driver modal', () => {
    mockProviderService.addDriver.mockReturnValue(of({}));
    component.addDriver(form);
    expect(mockProviderService.addDriver).toHaveBeenCalled();
  });

  it('should alert success on successful driver creation', () => {
    mockProviderService.addDriver.mockReturnValue(of(successMock));
    jest.spyOn(component.toastService, 'success');
    component.addDriver(form);
    expect(component.toastService.success).toHaveBeenCalled();
  });
  it('should alert error failure of driver creation', () => {
    mockProviderService.addDriver.mockReturnValue(throwError(new MockError
    (400, 'driverName must be unique')));
    jest.spyOn(component.toastService, 'error');
    component.addDriver(form);
    expect(component.toastService.error).toHaveBeenCalled();
  });
  it('should create driver object ', () => {
    const expected = { providerId: undefined,
      driverName: 'Test User',
      driverPhoneNo: '067546646',
      driverNumber: '245364' };
    const data = {
      value: {
        email: '',
        driverName: 'Test User',
        driverNumber: '245364',
        driverPhoneNo: '067546646'
      }
    };
    const results = DriverModalComponent.createDriverObject(data);
    expect(results).toEqual(expected);
  });


});
