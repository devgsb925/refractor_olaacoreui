import { EditProductModule } from './components/edit-product/edit-product.module';
import { ProductContentModule } from './components/product-content/product-content.module';
import { DetailViewModelService } from './detail-view-model.service';
import { DetailApiService } from './detail-api.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [DetailComponent],
  imports: [
    CommonModule,
    DetailRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    ProductContentModule,
    EditProductModule,

  ],
  providers: [
    DetailApiService,
    DetailViewModelService
  ]
})
export class DetailModule { }
