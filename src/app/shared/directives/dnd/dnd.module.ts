import { DndDirective } from './dnd.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [DndDirective],
  imports: [
    CommonModule
  ],
  exports: [
    DndDirective
  ]
})
export class DndModule { }
