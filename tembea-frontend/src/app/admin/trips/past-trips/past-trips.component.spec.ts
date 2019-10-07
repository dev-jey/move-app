import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastTripsComponent } from './past-trips.component';
import { AppTestModule } from 'src/app/__tests__/testing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';

describe('PastTripsComponent', () => {
  let component: PastTripsComponent;
  let fixture: ComponentFixture<PastTripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastTripsComponent ],
      imports: [ AppTestModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        {
          provide: MatDialog, useValue: {
            data: {
              tripInfo: {},
              closeText: 'close'
            }
          }
        },
      ]
    })
      .overrideTemplate(PastTripsComponent, `<div></div>`)
      .compileComponents();
    fixture = TestBed.createComponent(PastTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));


  it('should create past trips component', () => {
    expect(component).toBeDefined();
  });
});
