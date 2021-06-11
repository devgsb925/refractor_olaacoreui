import { Subscription } from 'rxjs';
import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';
import { IRefBrands } from './../../../orders/components/edit-order/model/i-ref-brands';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-select-brand',
  templateUrl: './select-brand.component.html',
  styleUrls: ['./select-brand.component.scss'],
})
export class SelectBrandComponent implements OnInit, OnDestroy {
  constructor(private refViewModel: ProductReferencesViewModel) {}

  newValue = '';
  filterValue = '';

  @Output() selectItem = new EventEmitter<IRefBrands>();
  @Output() closeEvent = new EventEmitter<boolean>();

  private subscription = new Subscription();

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getItemsFunc(): IRefBrands[] {
    return this.refViewModel
      .getBrands()
      .filter((brand) =>
        brand.name.toLowerCase().includes(this.filterValue.toLowerCase())
      )
      .sort(this.compareReverse);
  }

  selectItemFunc(item: IRefBrands): void {
    this.selectItem.next(item);
    this.closeEvent.next(true);
  }

  addNewFunc(): void {
    if (!this.refViewModel.checkExistBrand(this.newValue)) {
      const addNewSub = this.refViewModel
        .addBrandToApi(this.newValue, null)
        .subscribe((res) => {
          if (typeof res === 'number') {
            alert('Add new brand successful');
            this.refViewModel.addNewBrandToList({
              refBrandId: res,
              name: this.newValue,
              orderIndex: 0,
              url: ''
            });
            this.newValue = '';
          } else {
            const errorRes = res as HttpErrorResponse;
            alert(errorRes.error.text);
          }
        });
      this.subscription.add(addNewSub);
    } else {
      alert('This Brand has already! Please try again');
      this.newValue = '';
    }
  }

  compareReverse(a: IRefBrands, b: IRefBrands): number {
    if (a.orderIndex < b.orderIndex) {
      return 1;
    } else if ( a.orderIndex > b.orderIndex ){
      return -1;
    }
    return 0;
  }
}
