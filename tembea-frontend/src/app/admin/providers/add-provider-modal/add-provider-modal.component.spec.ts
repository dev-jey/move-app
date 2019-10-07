import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ProviderService} from '../../__services__/providers.service';
import { AddProviderModalComponent } from './add-provider-modal.component';
import {AlertService} from '../../../shared/alert.service';
import { of, throwError } from 'rxjs';
import { providerResponseMock} from './__mocks__/add-provider.mocks';
import {MockError} from '../../cabs/add-cab-modal/__mocks__/add-cabs-mock';

describe('AddProviderModalComponent', () => {
  let component: AddProviderModalComponent;
  let fixture: ComponentFixture<AddProviderModalComponent>;

  const mockProviderService = {
    add: jest.fn()
  };

  const mockMatDialogRef = {
    close: () => {},
  };

  const mockAlert = {
    success: jest.fn(),
    error: jest.fn()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProviderModalComponent ],
      imports: [FormsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: ProviderService, useValue: mockProviderService },
        { provide: AlertService, useValue: mockAlert}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProviderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('initial load', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('closeDialog', () => {
    it('should close the dialog', () => {
      jest.spyOn(component.dialogRef, 'close');
      component.closeDialog();
      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('addProvider', () => {
    it('should call providerService.add', () => {
      mockProviderService.add.mockReturnValue(of(providerResponseMock));
      component.addProvider();
      expect(component.providerService.add).toHaveBeenCalledTimes(1);
    });

    it('should call alert.success when request succeeds', () => {
      mockProviderService.add.mockReturnValue(of(providerResponseMock));
      jest.spyOn(component.alert, 'success');
      component.addProvider();
      expect(component.alert.success).toHaveBeenCalledTimes(1);
    });

    it('should call alert.error when request fails with 409 conflict', () => {
      const message = 'User with that name or email already exists';
      const error = new MockError(409, message);
      mockProviderService.add.mockReturnValue(throwError(error));
      jest.spyOn(component.alert, 'error');
      component.addProvider();
      expect(component.alert.error).toHaveBeenCalledTimes(1);
      expect(component.alert.error).toHaveBeenCalledWith(message);
    });

    it('should call alert.error when request fails with 404', () => {
      const message = 'Provider user not found';
      const error = new MockError(404, message);
      mockProviderService.add.mockReturnValue(throwError(error));
      jest.spyOn(component.alert, 'error');
      component.addProvider();
      expect(component.alert.error).toHaveBeenCalledTimes(1);
      expect(component.alert.error).toHaveBeenCalledWith('Provider user email entered does not exist');
    });

    it('should call alert.error for unknown errors', () => {
      const message = 'TypeError: just another error';
      const error = new MockError(500, message);
      mockProviderService.add.mockReturnValue(throwError(error));
      jest.spyOn(component.alert, 'error');
      component.addProvider();
      expect(component.alert.error).toHaveBeenCalledTimes(1);
      expect(component.alert.error).toHaveBeenCalledWith('Something went wrong, please try again');
    });
  });
});
