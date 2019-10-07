import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {map, startWith} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {MatAutocomplete} from '@angular/material';
import {IProviderInventory} from '../../../../shared/models/provider.model';
import {ProviderService} from '../../../__services__/providers.service';

@Component({
  selector: 'app-select-provider',
  templateUrl: './provider-selector.component.html',
  styleUrls: ['./provider-selector.component.scss']
})
export class ProviderSelectorComponent implements OnInit {
  public cols = 3;
  public rowHeight: any = '3:1';
  public colspan = 1;
  public disableOtherInput = false;
  filteredOptions: Observable<object[]>;
  providers: IProviderInventory[] = [];
  watcher: Subscription;
  activeMediaQuery = '';
  sort: string;

  @Input() approveForm;
  @Input() optionValue: string;
  @Output() emitAutoComplete = new EventEmitter();
  @Output() clickedProviders = new EventEmitter();
  @ViewChild('auto') auto: MatAutocomplete;

  constructor(
    public mediaObserver: MediaObserver,
    public providerService: ProviderService
  ) {
    this.sort = 'name,asc,batch,asc';
    this.watcher = mediaObserver['media$'].subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      switch (change.mqAlias) {
        case 'xs':
          this.setValues(2, '5:1', 2);
          break;
        case 'sm':
          this.setValues(3, '3:1', 1);
          break;
      }
    });
  }

  ngOnInit() {
    this.getProvidersInventory();
    this.emitAutoComplete.emit(this.auto);
  }

  startFiltering() {
    if (this.approveForm.controls) {
      this.filteredOptions = this.approveForm.valueChanges
        .pipe(startWith(''), map(this.keyWordFilter));
    }
  }

  keyWordFilter = (value: any) => {
    if (value.providerName === '') {
      this.disableOtherInput = false;
    }
    if (value.providerName) {
      return this._filter(value.providerName);
    }
    return this.providers;
  }

  _filter (value): object[] {
    const filterValue = value.toLowerCase();
    return this.providers.filter(
      option => {
        return option.name && option.name.toLowerCase().includes(filterValue);
      });
  }

  getProvidersInventory() {
    this.providerService.getProviders(1000, 1).subscribe(
      providersData => {
        const { providers } = providersData.data;
        this.providers = providers;
        this.startFiltering();
      });
  }

  click (option) {
    this.clickedProviders.emit(option);
  }

  setOption(option) {
    return option[this.optionValue];
  }

  setValues (cols: number, rowHeight: string, colspan: number) {
    this.cols = cols;
    this.rowHeight = rowHeight;
    this.colspan = colspan;
  }
}
