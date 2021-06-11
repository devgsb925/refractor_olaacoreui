import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModelComponent } from './select-model.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [SelectModelComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    SelectModelComponent
  ]
})
export class SelectModelModule { }
