import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectCategoryRoutingModule } from './select-category-routing.module';
import { SelectCategoryComponent } from './select-category.component';

@NgModule({
  declarations: [SelectCategoryComponent],
  imports: [CommonModule, SelectCategoryRoutingModule],
  exports: [SelectCategoryComponent],
})
export class SelectCategoryModule {}
