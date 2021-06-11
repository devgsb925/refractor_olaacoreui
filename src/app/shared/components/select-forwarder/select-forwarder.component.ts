import { HttpErrorResponse } from '@angular/common/http';
import { ISelectForwarder } from './interfaces/i-select-forwarder';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductReferencesViewModel } from '../../../view-model/product-references-view-model';

@Component({
  selector: 'app-select-forwarder',
  templateUrl: './select-forwarder.component.html',
  styleUrls: ['./select-forwarder.component.scss'],
})
export class SelectForwarderComponent implements OnInit {
  constructor(public refViewModel: ProductReferencesViewModel) {}

  filterValue = '';
  newValue = '';
  showList: ISelectForwarder[] = [];

  @Output() selectItem = new EventEmitter<ISelectForwarder>();
  @Output() closeEvent = new EventEmitter<boolean>();
  @Output() addNewListener = new EventEmitter<ISelectForwarder>();

  ngOnInit(): void {
    this.refViewModel
      .readForwarders()
      .toPromise()
      .then(
        (res) =>
          (this.showList = res.map((r) => {
            return {
              forwarderId: r.purchasingRefForwarderId,
              forwarderName: r.companyName,
              dateCreate: r.dateCreate,
              address: r.address
            };
          }))
      );
  }

  getShowListFunc(): ISelectForwarder[] {
    return this.showList.filter((s) =>
      s.forwarderName.toLowerCase().includes(this.filterValue.toLowerCase())
    );
  }

  selectItemFunc(item: ISelectForwarder): void {
    this.selectItem.next(item);
    this.closeEvent.next(true);
  }

  addNewFunc(): void {
    if (this.newValue !== '') {
      this.refViewModel
      .quickCreateForwarder(this.newValue)
      .toPromise()
      .then((res) => {
        if (typeof res === 'number' && res > 0) {
          const newForwarder = {
            forwarderId: res,
            forwarderName: this.newValue,
            dateCreate: Date().toString(),
            address: ''
          };
          this.showList = [newForwarder].concat(this.showList);
          this.addNewListener.next(newForwarder);
          this.newValue = '';
        } else {
          const errorRes: any = res;
          alert(errorRes.error.text);

        }
      });
   }
  }
}
