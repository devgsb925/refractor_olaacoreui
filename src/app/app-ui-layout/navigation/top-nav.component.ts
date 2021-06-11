import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/security/authenticate.service';

import { NavigationViewModel } from "./view-model/navigation-view-model";

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {


  constructor(
    public vmNavigation : NavigationViewModel,
    ) { }

  ngOnInit(): void {

  }

  logout(): void {

    localStorage.clear();
    document.location.href="/";

  }

  updatePageTitle(name) {

    this.vmNavigation.PageTitle = name;
    this.vmNavigation.showSubNavSideMenu = true;
  }

}
