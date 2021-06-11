import { ValuesSettingApiService } from './values-setting-api.service';
import { SortingModule } from 'src/app/shared/pipe/sorting.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ValuesSettingRoutingModule } from './values-setting-routing.module';
import { ValuesSettingComponent } from './values-setting.component';
import { BrandsComponent } from './components/brands/brands.component';
import { ProductNamesComponent } from './components/product-names/product-names.component';
import { VariantsComponent } from './components/variants/variants.component';
import { CouriersComponent } from './components/couriers/couriers.component';
import { ForwardersComponent } from './components/forwarders/forwarders.component';


@NgModule({
  declarations: [ValuesSettingComponent, BrandsComponent, ProductNamesComponent, VariantsComponent, CouriersComponent, ForwardersComponent],
  imports: [
    CommonModule,
    ValuesSettingRoutingModule,
    FormsModule,
    SortingModule,
    DragDropModule
  ],
  providers: [
    ValuesSettingApiService
  ]
})
export class ValuesSettingModule { }
