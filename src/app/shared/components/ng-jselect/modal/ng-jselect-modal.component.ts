import { Component, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-ng-jselect-modal',
  templateUrl: './ng-jselect-modal.component.html',
  styleUrls: ['./ng-jselect-modal.component.scss'],
})
export class NgJselectModalComponent implements AfterViewInit {
  @Input() Title: string = '';
  constructor() {}

  ngAfterViewInit(): void {}
}
