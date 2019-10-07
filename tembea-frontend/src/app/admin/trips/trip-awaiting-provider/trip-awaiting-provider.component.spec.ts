import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TripAwaitingProviderComponent } from '../trip-awaiting-provider/trip-awaiting-provider.component';
import { ExportComponent } from '../../export-component/export.component';
import { AppTestModule } from 'src/app/__tests__/testing.module';
import { AngularMaterialModule } from '../../../angular-material.module';
import { EmptyPageComponent } from '../../empty-page/empty-page.component';
import { AppPaginationComponent } from '../../layouts/app-pagination/app-pagination.component';
import { ShortenNamePipe } from '../../__pipes__/shorten-name.pipe';
import { ShortenTextPipe } from '../../__pipes__/shorten-text.pipe';

describe('TripAwaitingProviderComponent Unit test', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        TripAwaitingProviderComponent,
        ExportComponent,
        EmptyPageComponent,
        AppPaginationComponent,
        ShortenNamePipe,
        ShortenTextPipe
      ],
      imports: [
        AppTestModule,
        AngularMaterialModule
      ],
      schemas: []
    }).compileComponents();
  });

  it('should create component', () => {
    const fixture = TestBed.createComponent(TripAwaitingProviderComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });
});
