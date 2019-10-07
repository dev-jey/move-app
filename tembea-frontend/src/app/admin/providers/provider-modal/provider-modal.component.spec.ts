import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule, NgForm} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { of, throwError } from 'rxjs';
import { AlertService } from '../../../shared/alert.service';
import { ProviderModalComponent } from './provider-modal.component';
import { ProviderService } from '../../__services__/providers.service';
import { MockError } from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';
import { AppEventService } from '../../../shared/app-events.service';

const appEventService = new AppEventService();
export const toastService = {
  success: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn()
};
export const mockMatDialogRef = {
  close: () => {},
};
export const mockProviderService = {
  editProvider: jest.fn(),
  addDriver: jest.fn()
};
export const successMock = {
  success: true
};
describe('ProviderModalComponent', () => {
  let component: ProviderModalComponent;
  let fixture: ComponentFixture<ProviderModalComponent>;
  let form;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderModalComponent ],
      imports : [FormsModule],
      providers: [
        {provide: MatDialogRef, useValue: mockMatDialogRef},
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: AlertService, useValue: toastService },
        { provide: ProviderService, useValue: mockProviderService },
        { provide: AppEventService, useValue: appEventService }

      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    form = new NgForm([], []);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should create Provider Modal Component', () => {
    expect(component).toBeTruthy();
    expect(component.loading).toBeFalsy();
  });
    it('Should close the edit dialog', () => {
      jest.spyOn(component.dialogRef, 'close');
      component.closeDialog();
      expect(component.dialogRef.close).toBeCalled();
    });
    it('should call edit provider service', () => {
      mockProviderService.editProvider.mockReturnValue(of(successMock));
      component.editProvider(form, null);
      expect(mockProviderService.editProvider).toBeCalled();
    });

    it('should alert success on successful provider update', () => {
      mockProviderService.editProvider.mockReturnValue(of(successMock));
      jest.spyOn(component.toastService, 'success');
      jest.spyOn(component.dialogRef, 'close');
      jest.spyOn(AppEventService.prototype, 'broadcast');
      component.editProvider(form, null);
      expect(component.toastService.success).toBeCalled();
      expect(component.dialogRef.close).toBeCalled();
      expect(appEventService.broadcast).toBeCalled();
      expect(appEventService.broadcast).toBeCalledWith({name: 'updatedProvidersEvent'});
    });

  it('should alert error on  provider update fail and not close modal', () => {
    jest.spyOn(component.dialogRef, 'close');
    mockProviderService.editProvider.mockReturnValue(throwError(new MockError(404, 'User not found')));
    jest.spyOn(component.toastService, 'error');
    component.editProvider(form, null);
    expect(component.toastService.error).toBeCalled();
    expect(component.toastService.error).toBeCalledWith('User not found');
    expect(component.dialogRef.close).not.toBeCalled();
  });
  it('should set loading to false on edit provider', () => {
    mockProviderService.editProvider.mockReturnValue(of(successMock));
    component.editProvider(form, null);
    expect(component.loading).toBeFalsy();
  });
});
