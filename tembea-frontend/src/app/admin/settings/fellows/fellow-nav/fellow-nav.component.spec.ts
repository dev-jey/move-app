import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FellowNavComponent } from './fellow-nav.component';
import { FellowsComponent } from '../fellows.component';
import { ShortenNamePipe } from '../../../__pipes__/shorten-name.pipe';
import { AppTestModule } from '../../../../__tests__/testing.module';
import { AppEventService } from 'src/app/shared/app-events.service';

describe('FellowNavComponent', () => {
  let component: FellowNavComponent;
  let fixture: ComponentFixture<FellowNavComponent>;
  const appEventsMock = {
    broadcast: jest.fn()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FellowNavComponent, ShortenNamePipe, FellowsComponent ],
      imports: [ HttpClientTestingModule, AppTestModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        { provide: AppEventService, useValue: appEventsMock }
      ]
    })
    .overrideTemplate(FellowNavComponent, `<div></div>`)
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FellowNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const event = {
    index: 1,
    tripRequestType: 'onOrOffRoute',
    tab: {
      textLabel: 'On Route'
    },
    onRoute: 'On Route',
    totalItems: 4
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be broadcast updateHeaderTitle event', async(() => {
    component.fellowsCount = { 'On Route': 2, 'Off Route': 4 };
    const broadcastPayload = {
      tooltipTitle: event.tab.textLabel,
      badgeSize: component.fellowsCount['On Route']
    };
    component.getSelectedTab(event);
    expect(appEventsMock.broadcast).toHaveBeenCalledWith({ name: 'updateHeaderTitle', content: broadcastPayload });
  }));
  it('should mutate the value on fellowsCount', async(() => {
    component.fellowsOnRouteCount(event);
    expect(component.fellowsCount[event.onRoute]).toEqual(event.totalItems);
  }));
});
