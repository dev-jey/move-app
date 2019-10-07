import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ProviderService } from '../../__services__/providers.service';
import { IProviderInventory } from '../../../shared/models/provider.model';
import { SearchService } from '../../__services__/search.service';
import { AppEventService } from 'src/app/shared/app-events.service';
import { AlertService } from 'src/app/shared/alert.service';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';

@Component({
  selector: 'app-providers',
  templateUrl: './provider-inventory.component.html',
  styleUrls: [
    '../../cabs/cab-inventory/cab-inventory.component.scss',
    '../../../auth/login-redirect/login-redirect.component.scss'
  ],
  providers: [SearchService]
})
export class ProviderInventoryComponent implements OnInit, OnDestroy {
  providers: IProviderInventory[] = [];
  currentOptions = -1;
  pageNo: number;
  pageSize: number;
  totalItems: number;
  displayText: string;
  isLoading: boolean;
  searchTerm$ = new Subject<string>();
  updateSubscription: any;
  deleteSubscription: any;
  updateListSubscription: { unsubscribe: any };

  constructor(
    private searchService: SearchService,
    public appEventsService: AppEventService,
    public alert: AlertService,
    public providerService: ProviderService) {
    this.pageNo = 1;
    this.pageSize = ITEMS_PER_PAGE;
    this.isLoading = true;
    this.getSearchResults(this.searchTerm$);
  }

  ngOnInit() {
    this.getProvidersData();
    this.updateSubscription = this.appEventsService.subscribe('updatedProvidersEvent',
      () => this.getProvidersData());
      this.deleteSubscription = this.appEventsService.subscribe('providerDeletedEvent', () =>
      this.getProvidersData());
      this.updateListSubscription = this.appEventsService.subscribe('newProvider',
        () => this.getProvidersData());
  }

  getSearchResults = (searchItem) => {
    this.isLoading = true;
    this.searchService.searchData(searchItem, 'providers').subscribe(providersData => {
        const {
          providers, pageMeta: {
            totalResults
          }
        } = providersData;
        this.displayText = 'No providers yet';
        this.providers = providers;
        this.totalItems = totalResults;
        this.appEventsService.broadcast({name: 'updateHeaderTitle', content: {badgeSize: this.totalItems}});
        this.isLoading = false;
      },
      (error) => {
        if (error && error.error) {
          const {message} = error.error;
          this.alert.error(message);
          this.getSearchResults(this.searchTerm$);
        }
        this.isLoading = false;
        this.displayText = `Oops! We're having connection problems.`;
      });
  }

  getProvidersData = () => {
    this.isLoading = true;
    this.providerService.getProviders(this.pageSize, this.pageNo).subscribe(providerData => {
        const {
          providers, pageMeta: {
            totalResults
          }
        } = providerData.data;
        this.totalItems = totalResults;
        this.providers = providers;
        this.appEventsService.broadcast({
          name: 'updateHeaderTitle', content:
            {badgeSize: this.totalItems, actionButton: 'Add Provider'}
        });
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.displayText = `Oops! We're having connection problems.`;
      }
    );
    this.currentOptions = -1;
  }

  setPage(page: number): void {
    this.pageNo = page;
    this.getProvidersData();
  }

  showOptions(providerId) {
    this.currentOptions = this.currentOptions === providerId ? -1 : providerId;
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
      if (this.updateListSubscription) {
        this.updateListSubscription.unsubscribe();
      }
    }
  }
}
