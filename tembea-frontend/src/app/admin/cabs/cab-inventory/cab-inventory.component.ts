import { ICabModel } from './../../../shared/models/cab-inventory.model';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatDialog } from '@angular/material';
import { CabsInventoryService } from '../../__services__/cabs-inventory.service';
import { AppEventService } from 'src/app/shared/app-events.service';
import { ActivatedRoute } from '@angular/router';
import { BaseInventoryComponent } from '../../base-inventory/base-inventory.component';

@Component({
  selector: 'app-cabs',
  templateUrl: './cab-inventory.component.html',
  styleUrls: [
    './cab-inventory.component.scss',
    '../../../auth/login-redirect/login-redirect.component.scss'
  ]
})

export class CabInventoryComponent extends BaseInventoryComponent implements OnInit {
  cabs: ICabModel[] = [];
  displayText = 'No Vehicles yet';
  createText = 'Add a New Vehicle';
  updateSubscription: any;
  vehiclesSubscription: any;

  @Input() providerTabRequestType: string;
  @Output() cabsInfoEventEmitter = new EventEmitter();

  constructor(
    public cabService: CabsInventoryService,
    protected appEventsService: AppEventService,
    protected activatedRoute: ActivatedRoute,
    public dialog: MatDialog
    ) {
    super(appEventsService, activatedRoute, dialog);
  }

  ngOnInit() {
    this.vehiclesSubscription = this.activatedRoute.params.subscribe(
      data => this.updateInventory(data)
    );

    this.updateSubscription = this.appEventsService.subscribe(
      'newCab', () => this.getInventory()
    );
    this.updateSubscription = this.appEventsService.subscribe(
      'updateCab', () => this.getInventory()
    );

  }

  loadData (size, page, sort, providerId): void {

    this.cabService.get(size, page, sort, providerId ).subscribe(cabsData => {
      this.providerId = providerId;
        const { data, pageMeta: { totalItems }} = cabsData.data;
        this.totalItems = totalItems;
        this.cabs = data;
        this.isLoading = false;
        this.appEventsService.broadcast({
          name: 'updateHeaderTitle',
          content: {
            badgeSize: this.totalItems,
            actionButton: this.createText,
            headerTitle: `${this.providerName} Vehicles`,
            providerId: this.providerId
          }
        });
        this.emitData(this.cabsInfoEventEmitter);
      },
      () => {
        this.isLoading = false;
        this.displayText = `Oops! We're having connection problems.`;
      });
  }
}
