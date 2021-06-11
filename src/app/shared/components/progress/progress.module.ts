import { ProgressComponent } from './progress.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [ProgressComponent],
  imports: [
    CommonModule
  ],
  exports: [ProgressComponent]
})
export class ProgressModule { }
