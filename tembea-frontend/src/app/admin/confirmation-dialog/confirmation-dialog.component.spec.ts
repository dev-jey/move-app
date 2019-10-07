import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirmation-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EventEmitter } from '@angular/core';

describe('ConfirmModalComponent', () => {
  let fixture: ComponentFixture<ConfirmModalComponent>;
  let element: HTMLElement;
  let component: ConfirmModalComponent;

  const mockMatDialogRef = {
    close: () => {},
  };

  const mockMatDialogData = {
    data: {
      displayText: 'display data',
      confirmText: 'yes'
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmModalComponent ],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmModalComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  describe('initial load', () => {
    it('should have correct message', () => {
      expect(element.querySelector('p').textContent).toContain('Are you sure you want to ?');
    });
  });

  describe('functionality', () => {
    it('should close the dialog', () => {
      jest.spyOn(component.dialogRef, 'close');
      component.closeDialog();
      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should emit an event when confirmDialog is called', () => {
      const spy = jest.spyOn(EventEmitter.prototype, 'emit');
      component.confirmDialog();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
