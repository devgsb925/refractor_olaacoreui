import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticateService } from 'src/app/security/authenticate.service';
import { EndPoint } from 'src/app/security/end-point';
import { IPagePermissions } from './interfaces/i-page-permissions';
import { OrderPipes } from './pipes/order.pipes';
import { NavigationViewModel } from './view-model/navigation-view-model';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {

  posUrl = EndPoint.PosUri;

  selMenu = {
    IsActive: false,
    rolePageId: 0,
  };

  constructor(
    public vmAuthenticate: AuthenticateService,
    public vmNavigation: NavigationViewModel,
    private orderPipes: OrderPipes,
    private router: Router
  ) {}

  ngOnInit(): void {

    const pages = JSON.parse(localStorage.getItem('menu-pages'));

    if(pages !== null) {
      this.vmAuthenticate.pages = pages;
    } else {
      this.router.navigate(['/login']);
    }

  }

  getMainCategories(): IPagePermissions[] {

    let pageList =  this.vmAuthenticate.pages.filter(f=>f.parentId == 0 && f.menuPosition == 0);
    pageList = pageList.sort((a, b) => (a.orderIndex > b.orderIndex) ? 1 : -1);
    return pageList;
  }

  getSubMenus(): IPagePermissions[] {

    let pageList =  this.vmAuthenticate.pages.filter(f=>f.parentId == this.vmAuthenticate.subId && f.menuPosition == 0);
    pageList = pageList.sort((a, b) => (a.orderIndex > b.orderIndex) ? 1 : -1);
    return pageList;
  }


  onClickedSideMenuItem(sel: IPagePermissions) {
    this.vmNavigation.showSubNavSideMenu = true;
    this.vmAuthenticate.subId = sel.basePageId;
  }

  updatePageTitle(name: string): void {
    this.vmNavigation.PageTitle = name;
  }
}
