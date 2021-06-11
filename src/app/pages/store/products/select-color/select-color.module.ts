import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectColorComponent } from './select-color.component';

@NgModule({
  declarations: [SelectColorComponent],
  imports: [CommonModule, FormsModule],
  exports: [SelectColorComponent],
})
export class SelectColorModule {}
