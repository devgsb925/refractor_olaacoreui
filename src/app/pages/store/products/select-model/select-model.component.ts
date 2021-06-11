import { ProductReferencesViewModel } from './../../../../view-model/product-references-view-model';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { IRefModels } from '../../../orders/components/edit-order/model/i-ref-models';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-select-model',
  templateUrl: './select-model.component.html',
  styleUrls: ['./select-model.component.scss'],
})
export class SelectModelComponent implements OnInit, OnDestroy {
  constructor(private refViewModel: ProductReferencesViewModel) {}
  newValue = '';
  filterValue = '';

  @Output() selectItem = new EventEmitter<IRefModels>();
  @Output() closeEvent = new EventEmitter<boolean>();

  private subscription = new Subscription();

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getItemsFunc(): IRefModels[] {
    return this.refViewModel
      .getModels()
      .filter((model) =>
        model.name.toLowerCase().includes(this.filterValue.toLowerCase()))

      .sort(this.compareReverse);
  }

  selectItemFunc(item: IRefModels): void {
    this.selectItem.next(item);
    this.closeEvent.next(true);
  }

  addNewFunc(): void {
    if (!this.refViewModel.checkExistBrand(this.newValue)) {
      const addNewSub = this.refViewModel
        .addModelToApi(this.newValue)
        .subscribe((res) => {
          if (typeof res === 'number') {
            alert('Add new model successful');
            this.refViewModel.addNewModelToList({
              refModelId: res,
              name: this.newValue,
            });
            this.newValue = '';
          } else {
            const errorRes = res as HttpErrorResponse;
            alert(errorRes.error.text);
          }
        });
      this.subscription.add(addNewSub);
    } else {
      alert('This Model has already! Please try again');
      this.newValue = '';
    }
  }

  compareReverse(a: IRefModels, b: IRefModels): number {
    if (a.refModelId < b.refModelId) {
      return 1;
    } else if ( a.refModelId > b.refModelId ){
      return -1;
    }
    return 0;
  }
}
