import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { of, throwError } from 'rxjs';

import { AddDepartmentsModalComponent } from './add-departments-modal.component';
import { DepartmentsService } from 'src/app/admin/__services__/departments.service';
import { AlertService } from 'src/app/shared/alert.service';
import { responseMock, MockError } from '../__mocks__/add-department-mock';

describe('AddDepartmentsModalComponent', () => {
  let component: AddDepartmentsModalComponent;
  let fixture: ComponentFixture<AddDepartmentsModalComponent>;
  const department = {
    id: 1,
    name: 'asd',
    location: 'Lagos',
    email: 'tembea@andela.com',
    oldName: 'sdfsf'
  };

  const mockDepartmentService = {
    add: jest.fn(),
    update: jest.fn()
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDepartmentsModalComponent ],
      imports: [FormsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: DepartmentsService, useValue: mockDepartmentService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: AlertService, useValue: alert }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDepartmentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
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

describe('addDepartment', () => {
  it('should call addDepartment', () => {
    mockDepartmentService.add.mockReturnValue(of(responseMock));
    component.addDepartment();
    expect(component.departmentService.add).toHaveBeenCalledTimes(1);
  });

  it('should call AlertService.success upon success', () => {
    mockDepartmentService.add.mockReturnValue(of(responseMock));
    jest.spyOn(component.alert, 'success');
    component.addDepartment();
    expect(component.alert.success).toHaveBeenCalledTimes(1);
  });

  it('should call AlertService.error upon 404 status code', () => {
    const error = new MockError(404, 'Not working');
    mockDepartmentService.add.mockReturnValue(throwError(error));
    jest.spyOn(component.alert, 'error');
    component.addDepartment();
    expect(component.alert.error).toHaveBeenCalledTimes(1);
  });

  it('should call AlertService.error upon 409 status code', () => {
    const error = new MockError(409, 'Not working');
    mockDepartmentService.add.mockReturnValue(throwError(error));
    jest.spyOn(component.alert, 'error');
    component.addDepartment();
    expect(component.alert.error).toHaveBeenCalledTimes(1);
  });

  it('should call AlertService.error upon other error status codes', () => {
    const error = new MockError(400, 'something went wrong');
    mockDepartmentService.add.mockReturnValue(throwError(error));
    jest.spyOn(component.alert, 'error');
    component.addDepartment();
    expect(component.alert.error).toHaveBeenCalledTimes(1);
    expect(component.alert.error).toHaveBeenCalledWith('Something went wrong, please try again');
  });
});

  describe('updateDepartment', () => {
    it('should call updateDepartment', () => {
      mockDepartmentService.update.mockReturnValue(of(responseMock));
      jest.spyOn(component.alert, 'success');
      component.model = department;
      component.addDepartment();
      expect(component.departmentService.update).toHaveBeenCalledTimes(1);
      expect(component.alert.success).toHaveBeenCalledTimes(1);
    });

    it('should call AlertService.error upon 404 status code', () => {
      const error = new MockError(404, 'Not working');
      const dialogSpy = jest.spyOn(MatDialog.prototype, 'open');
      jest.spyOn(component.alert, 'error');

      mockDepartmentService.update.mockReturnValue(throwError(error));
      jest.spyOn(component.alert, 'error');
      component.model = department;
      component.addDepartment();
      expect(component.alert.error).toHaveBeenCalledTimes(1);
    });
  });

});


