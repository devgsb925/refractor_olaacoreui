import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectBrandComponent } from './select-brand.component';

@NgModule({
  declarations: [SelectBrandComponent],
  imports: [CommonModule, FormsModule],
  exports: [SelectBrandComponent],
})
export class SelectBrandModule {}
