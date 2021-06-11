import { SelectModelModule } from './../select-model/select-model.module';
import { SelectVendorModule } from './../select-vendor/select-vendor.module';
import { SelectSizeModule } from './../select-size/select-size.module';
import { SelectColorModule } from './../select-color/select-color.module';
import { SelectCategoryModule } from './../select-category/select-category.module';
import { SelectBrandModule } from './../select-brand/select-brand.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './add-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [AddProductComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectBrandModule,
    SelectCategoryModule,
    SelectColorModule,
    SelectSizeModule,
    SelectVendorModule,
    SelectModelModule
  ],
  exports: [
    AddProductComponent
  ]
})
export class AddProductModule { }
