import { BannerViewModelService } from './banner/banner-view-model.service';
import { BannerApiService } from './banner/banner-api.service';
import { ProductsModule } from './products/products.module';
import { StoreRoutingModule } from './store-routing.module';
import { StoreComponent } from './store.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsViewModelService } from './products/products-view-model.service';
import { ProductsApiService } from './products/products-api.service';
import { CategoriesViewModelService } from './categories/categories-view-model.service';
import { CategoriesApiService } from './categories/categories-api.service';
import { FormBuilder } from '@angular/forms';
import { AddProductViewModelService } from './products/add-product/add-product-view-model.service';
import { AddProductApiService } from './products/add-product/add-product-api.service';
import { ApiVendorService } from 'src/app/shared/components/vendors/api-vendor.service';
import { VmVendorService } from 'src/app/shared/components/vendors/vm-vendor.service';



@NgModule({
  declarations: [StoreComponent],
  imports: [
    CommonModule,
    StoreRoutingModule,
  ],
  providers: [
    ProductsViewModelService,
    ProductsApiService,
    CategoriesApiService,
    CategoriesViewModelService,
    AddProductViewModelService,
    AddProductApiService,
    BannerApiService,
    BannerViewModelService,
    FormBuilder,
    ApiVendorService,
    VmVendorService
  ]
})
export class StoreModule { }
