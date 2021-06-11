import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-values-setting',
  templateUrl: './values-setting.component.html',
  styleUrls: ['./values-setting.component.scss'],
})
export class ValuesSettingComponent implements OnInit {
  constructor() {}

  tabIndex = 0;

  ngOnInit() {
    const localIndex = localStorage.getItem('valueTabIndex');
    if (localIndex == null) {
      localStorage.setItem('valueTabIndex', this.tabIndex.toString());
    } else {
      this.tabIndex = parseInt(localIndex);
    }
  }

  setTabIndex(index: number): void {
    localStorage.setItem('valueTabIndex', index.toString());
    this.tabIndex = index;
  }
}
