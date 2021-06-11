import { SelectModelModule } from './../../../select-model/select-model.module';
import { SelectVendorModule } from '../../../select-vendor/select-vendor.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProductComponent } from './edit-product.component';
import { SelectSizeModule } from '../../../select-size/select-size.module';
import { SelectColorModule } from '../../../select-color/select-color.module';
import { SelectBrandModule } from '../../../select-brand/select-brand.module';
import { SelectCategoryModule } from '../../../select-category/select-category.module';
import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';



@NgModule({
  declarations: [EditProductComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,



    PaginationModule,


    SelectCategoryModule,
    SelectBrandModule,
    SelectColorModule,
    SelectColorModule,
    SelectSizeModule,
    SelectVendorModule,
    SelectModelModule
  ],
  exports: [
    EditProductComponent
  ]
})
export class EditProductModule { }
