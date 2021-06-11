import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { IVariant } from 'src/app/api/products/references/interfaces/i-variant';
import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';

@Component({
  selector: 'app-select-color',
  templateUrl: './select-color.component.html',
  styleUrls: ['./select-color.component.scss'],
})
export class SelectColorComponent implements OnInit, OnDestroy {
  constructor(private refViewModel: ProductReferencesViewModel) {}

  newValue = '';
  filterValue = '';

  @Output() selectItem = new EventEmitter<IVariant>();
  @Output() closeEvent = new EventEmitter<boolean>();

  private subscription = new Subscription();

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getItemsFunc(): IVariant[] {
    return this.refViewModel
      .getColors()
      .filter((color) =>
        color.variantValue
          .toLowerCase()
          .includes(this.filterValue.toLowerCase())
      )
      .sort(this.compareReverse);
  }

  selectItemFunc(item: IVariant): void {
    this.selectItem.next(item);
    this.closeEvent.next(true);
  }

  addNewFunc(): void {
    if (!this.refViewModel.checkExistVariant(this.newValue)) {
      const addNewSub = this.refViewModel
        .addVariantToApi(this.newValue, 'Color')
        .subscribe((res) => {
          if (typeof res === 'number') {
            alert('Add new color successful');
            this.refViewModel.addNewVariantToList({
              variantId: res,
              variantValue: this.newValue,
              refVariantName: 'Color',
            });
            this.newValue = '';
          } else {
            const errorRes = res as HttpErrorResponse;
            alert(errorRes.error.text);
          }
        });
      this.subscription.add(addNewSub);
    } else {
      alert('This Colour has already! Please try again');
      this.newValue = '';
    }
  }

  compareReverse(a: IVariant, b: IVariant): number {
    if (a.variantId < b.variantId) {
      return 1;
    } else if (a.variantId > b.variantId) {
      return -1;
    }
    return 0;
  }
}
