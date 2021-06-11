import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelAddVendorComponent } from './model-add-vendor.component';
import { ModelVendorDetailComponent } from './model-vendor-detail.component';

@NgModule({
  declarations: [ModelAddVendorComponent, ModelVendorDetailComponent],
  imports: [CommonModule, FormsModule],
  exports: [ModelAddVendorComponent, ModelVendorDetailComponent],
})
export class ModelModule {}
