import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { RouteRatingsService } from '../route-ratings.service';
import { mockRouteRatings} from '../../dashboard/route-ratings-overview/ratingsMockData';

describe('RouteRatingsService', () => {
  let service: RouteRatingsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteRatingsService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(RouteRatingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http get on getRouteAverages', () => {
    jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of({}));
    service.getRouteAverages({});
    expect(HttpClient.prototype.get).toHaveBeenCalled();
  });

  it('should return route ratings', () => {
    let ratings = null;
    jest.spyOn(HttpClient.prototype, 'get').mockReturnValue(of(mockRouteRatings));
    service.getRouteAverages({}).subscribe( res => {
      ratings = res;
    });
    expect(ratings).toEqual(mockRouteRatings);
  });
});
