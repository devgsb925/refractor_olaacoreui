import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectVendorComponent } from './select-vendor.component';

@NgModule({
  declarations: [SelectVendorComponent],
  imports: [CommonModule, FormsModule],
  exports: [SelectVendorComponent],
})
export class SelectVendorModule {}
