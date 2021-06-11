import { ModelModule } from './components/modal/model.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorsComponent } from './vendors.component';
import { VendorsRoutingModule } from './vendors-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from '../../shared/components/pagination/pagination.module';
import { VendorService } from './api/vendor.service';
import { VendorsViewModel } from './view-model/vendors-view-model';
import { SortingModule } from './pipe/sorting.module';
import { VendorProductComponent } from './components/vendor-product/vendor-product.component';
import { VendorOrderComponent } from './components/vendor-order/vendor-order.component';
import { VendorOrderDetailComponent } from './components/vendor-order/vendor-order-detail/vendor-order-detail.component';

@NgModule({
  declarations: [VendorsComponent, VendorProductComponent, VendorOrderComponent, VendorOrderDetailComponent],
  imports: [
    CommonModule,
    VendorsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PaginationModule,
    ModelModule,
    SortingModule,
  ],
  providers: [VendorService, VendorsViewModel],
})
export class VendorsModule {}
