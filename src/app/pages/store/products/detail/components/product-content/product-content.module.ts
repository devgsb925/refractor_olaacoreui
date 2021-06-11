import { DndModule } from './../../../../../../shared/directives/dnd/dnd.module';
import { ProgressModule } from '../../../../../../shared/components/progress/progress.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductContentComponent } from './product-content.component';



@NgModule({
  declarations: [ProductContentComponent],
  imports: [
    CommonModule,
    FormsModule,
    DndModule,
    ProgressModule
  ],
  exports: [ProductContentComponent]
})
export class ProductContentModule { }
