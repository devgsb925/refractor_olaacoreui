import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackingDeliveryComponent } from './packing-delivery.component';
import { FormsModule } from '@angular/forms';
import { PackingDeliveryRoutingModule } from './packing-delivery-routing.module';
import { PackingDeliveryResolverService } from './resolver/packing-delivery-resolver.service';




@NgModule({
  declarations: [PackingDeliveryComponent],
  imports: [
    CommonModule,
    FormsModule,
    PackingDeliveryRoutingModule
  ],
  providers: [
    PackingDeliveryResolverService
  ]
})
export class PackingDeliveryModule { }
