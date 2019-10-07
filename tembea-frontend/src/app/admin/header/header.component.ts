import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavMenuService } from '../__services__/nav-menu.service';
import { MatDialog } from '@angular/material';
import { ConfirmModalComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AuthService } from 'src/app/auth/__services__/auth.service';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { IUser } from '../../shared/models/user.model';
import { AppEventService } from '../../shared/app-events.service';
import { AddCabsModalComponent } from '../cabs/add-cab-modal/add-cab-modal.component';
import {AddProviderModalComponent} from '../providers/add-provider-modal/add-provider-modal.component';
import { DriverModalComponent } from '../providers/driver-modal/driver-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public headerTitle: string;
  public tooltipTitle: string;
  public badgeSize = 0;
  public actionButton = '';
  public providerId: number;
  user: IUser;
  updateHeaderSubscription: Subscription;
  logoutModalSub: Subscription;
  constructor(
    private navItem: NavMenuService,
    public dialog: MatDialog,
    public auth: AuthService,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appEventService: AppEventService
  ) { }

  ngOnInit() {
    this.user = this.auth.getCurrentUser();
    this.getHeaderTitleFromRouteData();
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.getHeaderTitleFromRouteData();
      }
    });
    this.updateHeaderSubscription = this.appEventService.subscribe('updateHeaderTitle', (data) => {
      const { content: { headerTitle, badgeSize, actionButton, tooltipTitle, providerId } } = data;
      this.headerTitle = headerTitle || this.headerTitle;
      this.tooltipTitle = tooltipTitle;
      this.badgeSize = badgeSize || 0;
      this.providerId = providerId;
      this.actionButton = actionButton || this.actionButton;
    });
    this.logoutModalSub = this.appEventService.subscribe('SHOW_LOGOUT_MODAL', () => this.showLogoutModal.call(this));
  }

  private getHeaderTitleFromRouteData() {
    let route = this.activatedRoute.firstChild;
    if (!route) {
      return;
    }
    while (route.firstChild) {
      route = route.firstChild;
    }
    if (route.outlet === 'primary') {
      route.data.subscribe(value => {
        this.headerTitle = value['title'];
        this.badgeSize = 0;
        this.actionButton = '';
        this.titleService.setTitle(`Tembea - ${this.headerTitle}`);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.updateHeaderSubscription) {
      this.updateHeaderSubscription.unsubscribe();
    }
    if (this.logoutModalSub) {
      this.logoutModalSub.unsubscribe();
    }
  }

  toggleSideNav = () => {
    this.navItem.toggle();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  showLogoutModal() {
    if (this.user) {
      const firstName = this.user.firstName;
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        width: '592px',
        backdropClass: 'modal-backdrop',
        panelClass: 'small-modal-panel-class',
        data: {
          displayText: `logout, ${firstName}`,
          confirmText: 'logout'
        }
      });
      dialogRef.componentInstance.executeFunction.subscribe(() => {
        this.logout();
      });
    }
  }
  handleAction() {
    const openModal = (Modal) => {
      this.dialog.open(Modal, {
        minHeight: '568px', width: '592px', panelClass: 'add-cab-modal-panel-class',
        data: { providerId: this.providerId }
      });
    };
    switch (this.actionButton) {
      case 'Add Provider':
        this.dialog.open(AddProviderModalComponent, {
          maxHeight: '568px', width: '620px', panelClass: 'add-cab-modal-panel-class', });
        break;
      case 'Add a New Vehicle':
        openModal(AddCabsModalComponent);
        break;
      case 'Add Driver':
        openModal(DriverModalComponent);
        break;
    }
  }
}
