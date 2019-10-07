import { Component, OnInit, Input } from '@angular/core';
import { AppEventService } from 'src/app/shared/app-events.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ITEMS_PER_PAGE } from 'src/app/app.constants';

@Component({
  selector: 'app-base-inventory',
  templateUrl: './base-inventory.component.html',
  styleUrls: ['./base-inventory.component.scss']
})
export class BaseInventoryComponent implements OnInit {
  providerId: any;
  providerName: any;
  pageNo: number;
  pageSize: number;
  totalItems: number;
  sort: string;
  isLoading: boolean;
  service: any;
  displayText: string;
  createText: string;
  currentOptions = -1;

  @Input() providerTabRequestType: string;

  constructor(
    protected appEventsService: AppEventService,
    protected activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
  ) {
    this.pageNo = 1;
    this.sort = 'name,asc,batch,asc';
    this.pageSize = ITEMS_PER_PAGE;
    this.isLoading = true;
  }

  ngOnInit() {
  }

  getInventory (): void {
    this.isLoading = false;
    this.currentOptions = -1;
    this.loadData(this.pageSize, this.pageNo, this.sort, this.providerId);
  }

  updateInventory (data: any): void {
    const { providerName, providerId } = data;
    this.providerName = providerName;
    this.providerId = providerId;
    if (!this.providerId) {return; }
    this.loadData(this.pageSize, this.pageNo, this.sort, this.providerId);
  }

  loadData(size: number, page: number, sort: string, providerId: number): void {
    throw new Error('Not implemented');
  }

  emitData(emitter: any): void {
    emitter.emit({
      totalItems: this.totalItems,
      providerName: this.providerName,
      actionButton: this.createText,
      providerTabRequestType: this.providerTabRequestType
    });
  }

  setPage(page: number): void {
    this.pageNo = page;
    this.getInventory();
  }


  showOptions(cabId) {
    this.currentOptions = this.currentOptions === cabId ? -1 : cabId;
  }
}
