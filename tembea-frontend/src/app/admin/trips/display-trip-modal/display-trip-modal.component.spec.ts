import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTripModalComponent } from './display-trip-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppTestModule } from 'src/app/__tests__/testing.module';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; 

import { ConvertNullValue } from '../../__pipes__/convert-nullValue.pipe';
import { ShortenNamePipe } from '../../__pipes__/shorten-name.pipe';
describe('DisplayTripModalComponent', () => {
  let component: DisplayTripModalComponent;
  let fixture: ComponentFixture<DisplayTripModalComponent>;
  const mockMatDialogData = {
    tripInfo: {
      distance: '12 km',
      requester: {
        name: 'sdfe'
      },
      rider: {
        name: 'sfdddsa'
      },
      provider: {
        name: 'Uber Kenya'
      },
      driver: {
        driverName: 'Savali'
      },
      cab: {
        model: 'Toyota',
        regNumber: 'KKKKK'
      },
      pickup: 'asd',
      destination: 'afsd',
      department: 'safd'
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayTripModalComponent, ConvertNullValue, ShortenNamePipe],
      imports: [AppTestModule, AngularMaterialModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTripModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
