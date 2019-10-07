import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FELLOW_ROUTES_PER_PAGE } from 'src/app/app.constants';

import { IFellowRoutes } from 'src/app/shared/models/fellow-routes.model';
import { FellowRouteService } from '../../../__services__/fellow-route.service';
import { AppEventService } from 'src/app/shared/app-events.service';

@Component({
  selector: 'app-fellow-details',
  templateUrl: './fellow.component.html',
  styleUrls: [
    '../../../routes/routes-inventory/routes-inventory.component.scss',
    './fellow.component.scss',
]
})
export class FellowComponent implements OnInit {

  fellowRoutes: IFellowRoutes[];
  fellowsData;
  userId: any;
  userName: string;
  firstName: string;
  pageNo: number;
  pageSize: number;
  totalItems: number;
  sort: string;
  isLoading: boolean;
  displayText = 'This fellow has no Routes yet 😒';
  routeBatchId: any;

  constructor(
    public fellowRouteService: FellowRouteService,
    private appEventsService: AppEventService,
    private activatedRoute: ActivatedRoute
  ) {
    this.pageNo = 1;
    this.pageSize = FELLOW_ROUTES_PER_PAGE;
    this.sort = 'name,asc,batch,asc';
    this.isLoading = true;
  }

  ngOnInit() {
    this.getFellowsRoutes();
  }

  getFellowsRoutes() {
      this.isLoading = true;
      this.userId  = this.activatedRoute.snapshot.paramMap.get('id');
      this.fellowRouteService.getFellowRoutes(this.userId, this.pageSize, this.pageNo, this.sort)
      .subscribe( fellowsRoutesData => {
      const {
         pageMeta,
         data
        } = fellowsRoutesData;
        if (!Array.isArray(data)) {
          this.isLoading = false;
          this.displayText = 'Something went wrong';
        } else {
          this.userDetails(data);
          this.isLoading = false;
          this.totalItems = pageMeta.totalItems;
          this.fellowsData = this.mapReturnedData(data);
          this.appEventsService.broadcast({
            name: 'updateHeaderTitle',
            content: { badgeSize: this.totalItems, headerTitle: `${ this.userName } Trip History` } });
        }
      }, () => {
        this.isLoading = false;
      this.displayText = 'The network is doing you no good 😄';
      }
    );
  }

  userDetails(data) {
    try {
      const {
        user: { name, routeBatchId }
      } = data[0];
      this.userName = name;
      this.firstName = name.split(' ')[0];
      this.routeBatchId = routeBatchId;
    } catch (err) {
      this.userName = '';
      this.isLoading = false;
      this.displayText = 'This fellow has no Routes yet 😒';
    }
  }

  setPage(page: number): void {
    this.pageNo = page;
    this.getFellowsRoutes();
  }

  mapReturnedData(data: any): IFellowRoutes {
    const theData = data.map(entry => {
      const {
        rating,
        userAttendStatus,
        routeUseRecord: {
          departureDate,
          cabDetails: {
            driverName,
            regNumber
          },
          route: {
            name,
            destination: {
              address
            }
          }
        }
      }  = entry;
      return { rating, userAttendStatus, departureDate, driverName, regNumber, name, address };
    });

    return theData;
  }
}
