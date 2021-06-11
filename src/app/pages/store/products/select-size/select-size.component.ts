import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IVariant } from 'src/app/api/products/references/interfaces/i-variant';
import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';

@Component({
  selector: 'app-select-size',
  templateUrl: './select-size.component.html',
  styleUrls: ['./select-size.component.scss']
})
export class SelectSizeComponent implements OnInit, OnDestroy {
  constructor(private refViewModel: ProductReferencesViewModel) { }

  newValue = '';
  filterValue = '';

  @Output() selectItem = new EventEmitter<IVariant>();
  @Output() closeEvent = new EventEmitter<boolean>();

  private subscription = new Subscription();

  ngOnInit(): void { }

  ngOnDestroy(): void{
    this.subscription?.unsubscribe();
  }

  getItemsFunc(): IVariant[] {
    return this.refViewModel
      .getSizes()
      .filter((size) =>
        size.variantValue.toLowerCase().includes(this.filterValue.toLowerCase())
      );
  }

  selectItemFunc(item: IVariant): void {
    this.selectItem.next(item);
    this.closeEvent.next(true);
  }

  addNewFunc(): void{
    if (!this.refViewModel.checkExistVariant(this.newValue)) {
      const addNewSub = this.refViewModel.addVariantToApi(this.newValue, 'Size').subscribe(res => {
        if (typeof res === 'number') {
          alert('Add new size successful');
          this.refViewModel.addNewVariantToList({ variantId: res, variantValue: this.newValue, refVariantName: 'Size' });
          this.newValue = '';
        } else {
          const errorRes = res as HttpErrorResponse;
          alert(errorRes.error.text);
        }
      });
      this.subscription.add(addNewSub);
    } else {
      alert('This Size has already! Please try again');
      this.newValue = '';
    }
  }
}
