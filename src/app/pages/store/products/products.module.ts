import { SelectModelModule } from './select-model/select-model.module';
import { SelectVendorModule } from './select-vendor/select-vendor.module';
import { SelectColorModule } from './select-color/select-color.module';
import { SelectSizeModule } from './select-size/select-size.module';
import { SelectBrandModule } from './select-brand/select-brand.module';
import { AddProductModule } from './add-product/add-product.module';
import { SelectCategoryModule } from './select-category/select-category.module';
import { NgjSelectModule } from './../../../shared/components/ngj-select/ngj-select.module';
import { PaginationModule } from './../../../shared/components/pagination/pagination.module';
import { FormsModule } from '@angular/forms';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FormsModule,
    PaginationModule,
    NgjSelectModule,
    AddProductModule,
    SelectCategoryModule,
    SelectBrandModule,
    SelectSizeModule,
    SelectColorModule,
    SelectVendorModule,
    SelectModelModule
  ]

})
export class ProductsModule { }
