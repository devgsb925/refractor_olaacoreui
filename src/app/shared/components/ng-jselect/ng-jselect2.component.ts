import { AfterViewInit, Component, Input } from '@angular/core';

import { INgjSelect2 } from './interfaces/i-ng-jselect';

@Component({
  selector: 'app-ng-jselect2',
  templateUrl: './ng-jselect2.component.html',
  styleUrls: ['./ng-jselect2.component.scss'],
})
export class NgJSelect2Component implements AfterViewInit {
  @Input() AutoComplete: boolean = false;
  @Input() DataSource: INgjSelect2[] = [];
  @Input() InputIcon: string = '';
  @Input() ActionIcon: string = '';

  itemList: INgjSelect2[] = [];
  selected: INgjSelect2 = {
    id: 1,
    name: '-',
    select: true,
  };

  hasInputIcon: boolean = false;
  hasActionIcon: boolean = false;

  showSearchList: boolean = false;
  showAddEditModal: boolean = false;

  constructor() {}

  ngAfterViewInit(): void {
    this.itemList = this.DataSource;

    if (this.InputIcon.length == 0) {
      this.hasInputIcon = true;
    }

    if (this.ActionIcon.length == 0) {
      this.hasActionIcon = true;
    }
  }

  onInputChange(): void {
    if (this.selected.name.length > 0) {
      const newList = this.DataSource.filter((f) =>
        f.name.toLowerCase().includes(this.selected.name.toLowerCase())
      );
      this.showSearchList = true;
      this.itemList = JSON.parse(JSON.stringify(newList));
    } else {
      this.itemList = JSON.parse(JSON.stringify(this.DataSource));
      this.showSearchList = true;
    }
  }

  onClickInput(): void {
    if (this.AutoComplete == false) {
      this.showSearchList = true;
    }
  }

  onSelectItem(sel: INgjSelect2): void {
    this.selected = sel;
    this.showSearchList = false;
  }
}
