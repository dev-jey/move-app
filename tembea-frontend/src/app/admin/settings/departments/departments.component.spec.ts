import { EmptyPageComponent } from './../../empty-page/empty-page.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/observable/of';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { throwError } from 'rxjs';

import { DepartmentsComponent } from './departments.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from '../../../angular-material.module';
import getdepartmentsServiceMock from './__mocks__/getDepartments.response.mock';
import { DepartmentsService } from '../../__services__/departments.service';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';
import { AlertService } from 'src/app/shared/alert.service';
import { ExportComponent } from '../../export-component/export.component';
import { ConfirmModalComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { AddDepartmentsModalComponent } from './add-departments-modal/add-departments-modal.component';
import { FormsModule } from '@angular/forms';


describe('DepartmentsComponent', () => {
  let departmentComponent: DepartmentsComponent;
  let fixture: ComponentFixture<DepartmentsComponent>;
  const alertMockData = {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn()
  };

  const departmentsServiceMock = {
    get: (size, pageNo) => {
      return of(getdepartmentsServiceMock);
    },
    delete: jest.fn().mockReturnValue(of({
      success: true,
      message: 'department deleted successfully'
    })),
    add: jest.fn().mockReturnValue(of({ success: true })),
  };


  const mockMatDialogRef = {
    close: () => {
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentsComponent, EmptyPageComponent,
        AppPaginationComponent, ExportComponent, AddDepartmentsModalComponent,
        ConfirmModalComponent ],
      imports: [HttpClientTestingModule, AngularMaterialModule,
        BrowserAnimationsModule, FormsModule],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: DepartmentsService, useValue: departmentsServiceMock },
        { provide: AlertService, useValue: alertMockData },
        {
          provide: MAT_DIALOG_DATA, useValue: {
            data: {
              confirmText: 'Yes',
              displayText: 'delete this department'
            }
          }
        },
      ],
    })
    .overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ConfirmModalComponent, AddDepartmentsModalComponent]
      }
    }).compileComponents();
    fixture = TestBed.createComponent(DepartmentsComponent);
    departmentComponent = fixture.componentInstance;
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should Exist - DepartmentsComponent', async(() => {
    expect(departmentComponent).toBeTruthy();
  }));

  it('should set departments correctly from the service', async(() => {
    jest.spyOn(departmentsServiceMock, 'get');
    fixture.detectChanges();
    expect(fixture.componentInstance.departments.length).toBe(4);
  }));

  it('should render actions button', async(() => {
    departmentComponent.getDepartments();
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('.actions-icon'));
    expect(button.length).toEqual(1);
  }));

  it('should create one active button for each department', async(() => {
    jest.spyOn(departmentsServiceMock, 'get');
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.active-status-button')).length).toBe(4);
  }));

  it('should update and load page', (() => {
    jest.spyOn(departmentComponent, 'getDepartments');
    expect(departmentComponent.pageNo).toEqual(1);
    departmentComponent.setPage(2);
    fixture.detectChanges();
    expect(departmentComponent.pageNo).toEqual(2);
    expect(departmentComponent.getDepartments).toHaveBeenCalled();
    expect(fixture.componentInstance.isLoading).toBe(false);
  }));

  it('should display an error message if error occured - "GET"', async () => {
    jest.spyOn(departmentComponent, 'getDepartments');
    jest.spyOn(departmentsServiceMock, 'get').mockReturnValue(throwError(new Error()));

    departmentComponent.getDepartments();
    fixture.detectChanges();
    expect(departmentComponent.displayText).toEqual(`Ooops! We're having connection problems.`);
    jest.restoreAllMocks();
  });


  describe('editDepartment', () => {
    it('should prepopulate modal with the department info', () => {
      const dialogSpy = jest.spyOn(MatDialog.prototype, 'open');
      jest.spyOn(departmentComponent, 'getDepartments');
      departmentComponent.getDepartments();
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('.edit-icon'));
      buttons[0].triggerEventHandler('click', null);
      expect(dialogSpy).toBeCalledTimes(1);
    });
  });

  describe('addDepartment', () => {
    it('should open modal when add button is clicked', () => {
      const dialogSpy = jest.spyOn(MatDialog.prototype, 'open');
      jest.spyOn(departmentComponent, 'getDepartments');
      departmentComponent.getDepartments();
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('.fab'));
      buttons[0].triggerEventHandler('click', null);
      expect(dialogSpy).toBeCalledTimes(1);
    });
  });


  describe('showDeleteModal', () => {
    it('should open delete modal when delete icon is clicked', () => {
      const dialogSpy = jest.spyOn(MatDialog.prototype, 'open');

      departmentComponent.getDepartments();
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('.decline-icon'));
      buttons[0].triggerEventHandler('click', null);
      expect(dialogSpy).toBeCalledTimes(1);
    });
  });


  describe('deleteDepartment', () => {
    it('should delete a department success response from http call', () => {
      const departmentSpy = jest.spyOn(departmentComponent, 'getDepartments');
      const deleteSpy = jest.spyOn(departmentsServiceMock, 'delete');
      departmentComponent.getDepartments();
      fixture.detectChanges();

      departmentComponent.deleteDepartment(1, 'Launchpad');

      expect(deleteSpy).toHaveBeenCalled();
      expect(alertMockData.success).toBeCalledWith('Launchpad was Successfully Deleted');
      expect(departmentSpy).toHaveBeenCalled();
    });

    it('should display an error message if department delete is unsuccessful', async () => {
      jest.spyOn(departmentsServiceMock, 'delete').mockReturnValue(throwError(new Error()));

      departmentComponent.getDepartments();
      fixture.detectChanges();

      departmentComponent.deleteDepartment(1, 'Launchpad');
      expect(alertMockData.error).toHaveBeenCalledTimes(1);
    });

  });
});
