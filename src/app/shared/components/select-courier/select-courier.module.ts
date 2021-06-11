import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectCourierComponent } from './select-courier.component';



@NgModule({
  declarations: [SelectCourierComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [SelectCourierComponent]
})
export class SelectCourierModule { }
