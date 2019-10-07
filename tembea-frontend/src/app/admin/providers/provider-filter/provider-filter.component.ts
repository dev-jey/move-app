import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderService } from '../../__services__/providers.service';
import { IProviderInventory } from '../../../shared/models/provider.model';

@Component({
  selector: 'app-provider-filter',
  templateUrl: './provider-filter.component.html',
  styleUrls: ['../../cabs/cab-inventory/cab-inventory.component.scss']
})
export class ProviderFilterComponent implements OnInit {
  providers: IProviderInventory[] = [];
  providerName: string;
  providerId: number;
  providersPrefix = 'admin/providers';
  selectedProvider: any;

  constructor(
    public providerService: ProviderService,
    private ngZone: NgZone,
    private router: Router) {
  }

  ngOnInit() {
    this.getProvidersData();
  }

  getProvidersData = () => {
    this.providerService.getProviders(1000, 1).subscribe(
      providerData => {
        const { providers } = providerData.data;
        this.providers = providers;
      });
  }

  onProviderSelected(provider: any) {
    const providerUrl = `${this.providersPrefix}/${provider.name}/${provider.id}`;
    this.ngZone.run(() => this.router.navigateByUrl(providerUrl));
  }

}
