import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FellowCardComponent } from './fellow-card.component';
import { MatDialog } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

describe('FellowCardComponent', () => {
  let component: FellowCardComponent;
  let fixture: ComponentFixture<FellowCardComponent>;
  const emit = jest.fn();
  const matDialogMock = {
    open: jest.fn().mockReturnValue({
      componentInstance: {
        removeUser: {
          subscribe: () => emit()
        }}
       })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FellowCardComponent],
      imports: [ RouterTestingModule.withRoutes([])],
      providers: [
        { provide: MatDialog, useValue: matDialogMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FellowCardComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }));

  it('should create fellow card component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog successfully', () => {
    component.showFellowDeleteModal();

    expect(matDialogMock.open).toBeCalledTimes(1);
    expect(emit).toBeCalledTimes(1);
  });
});


