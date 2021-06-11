import { ProductReferencesViewModel } from 'src/app/view-model/product-references-view-model';
import { IRefCategory } from './../../../../api/products/references/interfaces/i-ref-category';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select-category',
  templateUrl: './select-category.component.html',
  styleUrls: ['./select-category.component.scss'],
})
export class SelectCategoryComponent implements OnInit {
  constructor(private refViewModel: ProductReferencesViewModel) {}

  @Input() category1Id = 0;
  @Input() category2Id = 0;
  @Input() category3Id = 0;

  @Output() selectCategoryResult = new EventEmitter<IRefCategory[]>();
  @Output() closeEvent = new EventEmitter<boolean>();

  ngOnInit(): void {}

  getCategory(index: number): IRefCategory[] {
    const categories = this.refViewModel.getCategories();
    switch (index) {
      case 0:
        return categories.filter((c) => c.parentId === 1).sort(this.compare);
      case 1:
        return this.category1Id !== 0
          ? categories.filter((c) => c.parentId === this.category1Id).sort(this.compare)
          : [];
      case 2:
        return this.category2Id !== 0
          ? categories.filter((c) => c.parentId === this.category2Id).sort(this.compare)
          : [];
    }
  }

  selectCategory(item: IRefCategory, index: number): void {
    switch (index) {
      case 0:
        this.category1Id =
          this.category1Id !== 0 && this.category1Id === item.refCategoryId
            ? 0
            : item.refCategoryId;
        this.category2Id = 0;
        this.category3Id = 0;
        break;
      case 1:
        this.category2Id =
          this.category2Id !== 0 && this.category2Id === item.refCategoryId
            ? 0
            : item.refCategoryId;
        this.category3Id = 0;
        break;
      case 2:
        this.category3Id =
          this.category3Id !== 0 && this.category3Id === item.refCategoryId
            ? 0
            : item.refCategoryId;
        break;
    }
  }

  saveFunc(): void {
    const category1: IRefCategory = this.refViewModel.getCategoryById(
      this.category1Id
    );
    const category2: IRefCategory = this.refViewModel.getCategoryById(
      this.category2Id
    );
    const category3: IRefCategory = this.refViewModel.getCategoryById(
      this.category3Id
    );
    this.selectCategoryResult.next([category1, category2, category3]);
  }

  compare( a: IRefCategory, b: IRefCategory ): number {
    if ( a.orderIndex < b.orderIndex ){
      return -1;
    }
    if ( a.orderIndex > b.orderIndex ){
      return 1;
    }
    return 0;
  }
}
