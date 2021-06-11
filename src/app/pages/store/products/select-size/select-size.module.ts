import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectSizeComponent } from './select-size.component';

@NgModule({
  declarations: [SelectSizeComponent],
  imports: [CommonModule, FormsModule],
  exports: [SelectSizeComponent],
})
export class SelectSizeModule {}
