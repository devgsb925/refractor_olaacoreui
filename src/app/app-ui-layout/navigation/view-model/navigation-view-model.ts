import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IPagePermissions } from '../interfaces/i-page-permissions';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class NavigationViewModel {

  PageTitle = 'Dashboard';
  dropdown = false;
  showNavSideMenu = true;
  showSubNavSideMenu = false;

  constructor() { }

  showSubNavFunc(show: boolean): void {
    this.showSubNavSideMenu = show;
  }

  sideNavEvent(): void {
    this.showNavSideMenu = !this.showNavSideMenu;
    this.showSubNavSideMenu = false;
  }

  dropdownMenuFunc(): void {
    this.dropdown = !this.dropdown;
  }
  closeMenu(): void {
    this.dropdown = false;
  }

}
