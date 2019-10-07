import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '../../../shared/alert.service';
import { DriverCardComponent } from './driver-card.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { of } from 'rxjs';

const mockMatDialogRef = {
  close: () => { },
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
describe('DriverCardComponent', () => {
  let component: DriverCardComponent;
  let fixture: ComponentFixture<DriverCardComponent>;

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DriverCardComponent],
      imports: [ RouterTestingModule.withRoutes([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: MatDialog, useValue: matDialogMock },
      { provide: MatDialogRef, useValue: mockMatDialogRef },
      { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
      { provide: AlertService, useValue: alert }
      ],
    })
      .compileComponents();
    fixture = TestBed.createComponent(DriverCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show more options', () => {
    jest.spyOn(component.showOptions, 'emit').mockImplementation();
    component.showMoreOptions();
    expect(component.showOptions.emit).toBeCalled();
  });
  it('should open dialog successfully', () => {
    component.showDeleteModal();
    expect(matDialogMock.open).toBeCalledTimes(1);
  });
  it('should create subscription to Modal closing event" ', () => {
    component.showDeleteModal();
    expect(component.dialogRef).toBeDefined();
    component.dialogRef.afterClosed().subscribe(() => {
      expect(component.refreshWindow.emit).toHaveBeenCalled();
    });
  });
  it('should open edit modal', () => {
    jest.spyOn(matDialogMock, 'open');
    component.openEditModal();
    expect(matDialogMock.open).toHaveBeenCalled();
    expect(component.editDialogRef).toBeDefined();
    component.editDialogRef.afterClosed().subscribe(() => {
      expect(component.refreshWindow.emit).toHaveBeenCalled();
    });
  });
  it('should show more options', () => {
    jest.spyOn(component.showOptions, 'emit').mockImplementation();
    component.showMoreOptions();
    expect(component.hidden).toBe(true);
    expect(component.showOptions.emit).toBeCalled();
  });
});
