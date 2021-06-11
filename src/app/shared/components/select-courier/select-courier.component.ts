import { ProductReferencesViewModel } from '../../../view-model/product-references-view-model';
import { ISelectCourier } from './interfaces/i-select-courier';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-courier',
  templateUrl: './select-courier.component.html',
  styleUrls: ['./select-courier.component.scss'],
})
export class SelectCourierComponent implements OnInit {
  constructor(public refViewModel: ProductReferencesViewModel) {}

  filterValue = '';
  showList: ISelectCourier[] = [];
  newValue = '';

  @Output() selectItem = new EventEmitter<ISelectCourier>();
  @Output() closeEvent = new EventEmitter<boolean>();
  @Output() addNewListener = new EventEmitter<ISelectCourier>();


  ngOnInit(): void {
    this.refViewModel.readCouriers().toPromise().then(res => this.showList = res.map(r => {
      return {
        courierId: r.purchasingRefCourierId,
        courierName: r.companyName,
        address: r.address,
        dateCreate: r.dateCreate
      };
    }));
  }

  getShowListFunc(): ISelectCourier[] {
    return this.showList.filter(s => s.courierName.toLowerCase().includes(this.filterValue.toLowerCase()))
  }

  selectItemFunc(item: ISelectCourier): void {
    this.selectItem.next(item);
    this.closeEvent.next(true);
  }
  addNewFunc(): void {
    if (this.newValue !== '') {
      this.refViewModel
      .quickCreateCouriers(this.newValue, '')
      .toPromise()
      .then((res) => {
        if (typeof res === 'number' && res > 0) {
          const newCourier = {
            courierId: res,
            courierName: this.newValue,
            address: '',
            dateCreate: Date().toString()
          };
          this.showList = [newCourier].concat(this.showList);
          this.addNewListener.next(newCourier);
          this.newValue = '';
        }
        else {
          const errorRes: any = res;
          alert(errorRes.error.text);
        }
      });
    }
  }
}
