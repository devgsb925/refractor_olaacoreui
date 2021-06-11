import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPipes } from './order.pipes';

@NgModule({
  declarations: [OrderPipes],
  imports: [
    CommonModule    
  ],
  exports: [
    OrderPipes
  ],
  providers: [
    OrderPipes
  ]
})
export class OrderPipesModule { }